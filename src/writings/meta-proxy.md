---
author: stepit
title: "ERC-3448 easily explained"
slug: "erc-3448-easily-explained"
created: 2026-02-13
modified: 2026-02-13
summary: ""
category: ""
tags: [blockchain, ethereum, solidity]
related: []
to-publish: true
---

## Introduction

[ERC-3448: MetaProxy Standard](https://eips.ethereum.org/EIPS/eip-3448) defines
a standard for using proxies with immutable metadata attached to them. The
unique feature of this standard is that the immutability of the metadata is
achieved by attaching it directly to the bytecode of the proxy itself.

While many other standards for proxy design exist, such as the **Transparent
Proxy Pattern** and the **Universal Upgradeable Proxy Standard (UUPS)**,
ERC-3448 serves a distinct purpose. This standard is relatively more complex to
grasp than the aforementioned approaches, but it is straightforward to use once
the underlying principles are understood.

The complexity of ERC-3448 arises mainly from the fact that it manipulates EVM
opcodes directly instead of writing Solidity code. To understand the logic of
these contracts, one must understand how these opcodes orchestrate the state
transition and retrieve the attached data. Unlike other proxies, we cannot
simply read standard Solidity code to figure out what is going on.

## Intuition

To simplify the next technical deep dive into low-level Ethereum Virtual Machine
(EVM), we can try to have a first intuition of the proxy mechanics. Let's
consider the two classic approaches to using the same contract multiple times
with different configuration variables.

To follow along, it should help considering a smart contract as the equivalent
of a function, let's say a polynomial $f(x) = a_0 + a_1 x + \ldots + a_n x^n$.
Our goal with the polynomial contract is to compute the value $f(x)$ once
interrogated with a particular value. To completely specify the poly, we must
provide the value of the coefficients $a_0, \ldots, a_n$. What will remain
always the same, regardless of this information, is for example how to multiply
the numbers to compute the powers and then how to sum up all the monomials
together to obtain the final value.

**Case 1**: the simplest approach to consider is the deployment of the same
contract multiple times providing different construction variables. This
approach is very naive and not very smart, since it requires paying multiple
time gas for exactly the same operations. In this case, we deploy every times
the algorithms to compute the algebraic rules, and the values for coefficients.

One may think here, why don't we deploy the algebraic rule algorithms once and
reuse them across all the poly contracts?

**Case 2**: This approach is a consequence of the previous consideration. We
deploy the contract with the logic to compute the polynomial results given the
coefficient values separately and call it the **implementation**. Then, for
every polynomial we have to compute, we create a new contract, called **proxy**,
which allows us to specify the coefficient values while using the implementation
to compute the polynomial values.

In case two we saved a lot of gas by deploying only once the operations that are
common to multiple contracts. Well, this is nice, but if the degree of the
polynomial is high, it could be expensive to load all the coefficients from the
storage every time a user wants to compute the value of the function.

**Case 3**: Here is where the meta proxy approach comes in! The approach is
similar to case 2, we deploy a new proxy for every polynomial configuration, but
instead of storing the coefficients in the state, we attach them directly to the
bytecode. This way, all the time we get the contract bytecode to execute the
logic, we already have all the information we need. We bake the configuration
directly onto the contract. Remember that the bytecode is the list of opcodes
used in the execution of the contract itself.

Now that we have an idea of what we want to do with the meta proxy standard,
let's dive into it.

## Standard

The reference implementation of the standard defines directly the bytecode of
the `MetaProxy` contract as follows:

```text
                                              20 bytes target contract address
                                          ----------------------------------------
363d3d373d3d3d3d60368038038091363936013d7300000000000000000000000000000000000000005af43d3d93803e603457fd5bf3
```

Where each pair of numbers represents the HEX encoded reference of an
[EVM opcode](https://ethereum.org/developers/docs/evm/opcodes). After the meta
proxy contract, we can add whatever metadata we want, as long as we respect the
pattern defined by the standard:

```text
<54 bytes metaproxy> <arbitrary data> <length in bytes of arbitrary data (uint256)>
```

Please notice that this is what we are going to store in the EVM, but to deploy
this contract we need also the deployment bytecodes, obtaining the final
structure given by:

```text
<deployment bytecode><54 bytes metaproxy> <arbitrary data> <length in bytes of arbitrary data (uint256)>
```

### Deployment bytecode

The deployment bytecode is given by the string `600b380380600b3d393df3` and is
called the constructor logic. Remember that these opcodes are used only during
the deployment of a contract but are then discarded and not stored on-chain.

| Opcode Hex | Instruction    | Description/Notes                                                                       |
| ---------- | -------------- | --------------------------------------------------------------------------------------- |
| 0x60       | PUSH1 11       | Push the number 11, which is the number of opcodes in the constructor, onto the stack   |
| 0x38       | CODESIZE       | Push the size of the entire meta proxy contract onto the stack                          |
| 0x03       | SUB            | Subtract the two previous number to have only the number of opcodes that must be stored |
| 0x80       | DUP1           | Duplicate the value                                                                     |
| 0x60       | PUSH1 11       | Push again the number 11                                                                |
| 0x3d       | RETURNDATASIZE | Push the number 0 to the stack; no return data yet                                      |
| 0x39       | CODECOPY       | We copy the opcodes to store onto the memory                                            |
| 0x3d       | RETURNDATASIZE | Push again the number 0                                                                 |
| 0xf3       | RETURN         | Return what we have in memory, i.e. the opcodes to store                                |

It is interesting to notice that we use the `RETURNDATASIZE` instead of the
`PUSH1 00`. The reason is that, since we don't have return data yet, this is a
smart way to push the bytes 0 onto the stack because it costs 2 gas instead of
3!

To summarize, this constructor bytecode is used to return to the EVM the
bytecodes associated with
`<54 bytes metaproxy> <arbitrary data> <length in bytes of arbitrary data (uint256)>`.

### Metaproxy bytecode

The metadata bytecode is what actually is executed all the time we try to
interact with the contract.

To understand what the meta proxy bytecode represents, we can split it in 3
chunks:

$$
\text{Bytecode} = \underbrace{\text{PREFIX}}_{\text{Setup}} + \underbrace{\text{ADDRESS}}_{\text{Implementation}} + \underbrace{\text{SUFFIX}}_{\text{Execution}}
$$

The central part is not very important here, since it is just the address of the
implementation contract we are going to use to effectively execute the state
transition. Let's understand what the other two components are used for.

#### Prefix

The prefix sequence is given by the following opcodes:

| Opcode Hex | Instruction    | Stack State                                              | Notes / Description                                                                 |
| :--------- | :------------- | :------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| `0x36`     | CALLDATASIZE   | `calldatasize`                                           | Get the size of the user-provided inputs                                            |
| `0x3d`     | RETURNDATASIZE | `0, calldatasize`                                        | Push the value 0 to the stack                                                       |
| `0x3d`     | RETURNDATASIZE | `0, 0, calldatasize`                                     | Push another 0                                                                      |
| `0x37`     | CALLDATACOPY   | (empty)                                                  | Copies calldata to memory                                                           |
| `0x3d`     | RETURNDATASIZE | `0`                                                      | Push a 0                                                                            |
| `0x3d`     | RETURNDATASIZE | `0, 0`                                                   | Push a 0                                                                            |
| `0x3d`     | RETURNDATASIZE | `0, 0, 0`                                                | Push a 0                                                                            |
| `0x3d`     | RETURNDATASIZE | `0, 0, 0, 0`                                             | Push a 0                                                                            |
| `0x60`     | PUSH1 54       | `54, 0, 0, 0, 0`                                         | Push the number of bytes associated with the meta proxy contract                    |
| `0x80`     | DUP1           | `54, 54, 0, 0, 0, 0`                                     | Copy the value 54                                                                   |
| `0x38`     | CODESIZE       | `codesize, 54, 54, 0, 0, 0, 0`                           | Push the total number of bytes in the bytecode; 54 + metadata length + length value |
| `0x03`     | SUB            | `codesize-54, 54, 0, 0, 0, 0`                            | Remove the meta proxy bytes length to have only the metadata and its length         |
| `0x80`     | DUP1           | `codesize-54, codesize-54, 54, 0, 0, 0, 0`               |                                                                                     |
| `0x91`     | SWAP2          | `54, codesize-54, codesize-54, 0, 0, 0, 0`               |                                                                                     |
| `0x36`     | CALLDATASIZE   | `calldatasize, 54, codesize-54, codesize-54, 0, 0, 0, 0` | Push the length of the user-provided calldata                                       |
| `0x39`     | CODECOPY       | `codesize-54, 0, 0, 0, 0`                                | Copy the metadata into memory; memory is now: calldata \| metadata                  |
| `0x36`     | CALLDATASIZE   | `calldatasize, codesize-54, 0, 0, 0, 0`                  | Push calldata length to the stack                                                   |
| `0x01`     | ADD            | `calldatasize+codesize-54, 0, 0, 0, 0`                   | Obtain the overall memory length                                                    |
| `0x3d`     | RETURNDATASIZE | `0, calldatasize+codesize-54, 0, 0, 0, 0`                | Push 0 to the stack                                                                 |
| `0x73`     | PUSH20 0       | `addr, 0, calldatasize+codesize-54, 0, 0, 0, 0`          | Push the implementation address to the stack                                        |

So, the prefix bytecode is used to put the user-provided calldata and contract
metadata onto the memory, and prepare the implementation contract to call into
the stack.

#### Suffix

The suffix sequence is given by:

| Opcode Hex | Instruction    | Stack State                                          | Notes / Description                                                                                      |
| :--------- | :------------- | :--------------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| `0x5a`     | GAS            | `gas, addr, 0, calldatasize+codesize-54, 0, 0, 0, 0` | Push the remaning gas value to the stack                                                                 |
| `0xf4`     | DELEGATECALL   | `retcode`                                            | Executes call to the implementation with calldata concatenated with metadata ; 1 if success, 0 if revert |
| `0x3d`     | RETURNDATASIZE | `returndatasize, retcode, 0, 0`                      | Ask the EVM the size of returned data                                                                    |
| `0x3d`     | RETURNDATASIZE | `returndatasize, returndatasize, retcode, 0, 0`      | Ask the same                                                                                             |
| `0x93`     | SWAP4          | `0, returndatasize, retcode, 0, returndatasize`      | Reordering for RETURNDATACOPY                                                                            |
| `0x80`     | DUP1           | `0, 0, returndatasize, retcode, 0, returndatasize`   |                                                                                                          |
| `0x3e`     | RETURNDATACOPY | `retcode, 0, returndatasize`                         | Copies return data to memory at index 0                                                                  |
| `0x60`     | PUSH1 52       | `dest, retcode, 0, returndatasize`                   | Pushes JUMPDEST offset                                                                                   |
| `0x57`     | JUMPI          | `0, returndatasize`                                  | Jumps to JUMPDEST if retcode == 1, continue otherwise                                                    |
| `0xfd`     | REVERT         | (empty)                                              | If not jump, reverts with data in memory if call failed                                                  |
| `0x5b`     | JUMPDEST       | `0, returndatasize`                                  | The success jump destination                                                                             |
| `0xf3`     | RETURN         | (empty)                                              | Returns data in memory if call succeeded                                                                 |

So, the suffix part is what really execute the implementation contract by
providing the user-provided calldata appended with metadata information. When
the implementation returns, the suffix bytecodes handle the returned values or
revert. Remember that calldata specifies to a contract which method we want to
execute, and the parameters to use.

## Retrieving data

We have had a long journey so far through a complex sequence of low-level EVM,
stack, and memory operations. To completely understand the ERC-3448, we need one
last step. In the final step of the previous section we arrived at a point in
which we routed the call from the proxy to the implementation. In doing so, we
padded the user-provided inputs the proxy metadata. The question now is, how
does the called implementation use the metadata?

The called contract, will be fed with a calldata composed of the following
pieces:

$$
\text{Calldata} = \underbrace{\text{FUNCTION SELECTOR} + \text{ARGS}}_{\text{User Input}} + \text{METADATA} + \underbrace{\text{METADATA SIZE}}_{\text{32 bytes}}
$$

A generic contract cannot be used directly as the implementation for a meta
proxy. The implementation must know to be part of a bigger picture because it
has to implement custom logic to read the metadata it receives. To do so, in the
ERC document we can find this snippet:

```solidity
function getMetadataWithoutCall () public pure returns (
  address a,
  uint256 b,
  uint256[] memory c
) {
  bytes memory data;
  assembly {
    let posOfMetadataSize := sub(calldatasize(), 32)
    let size := calldataload(posOfMetadataSize)
    let dataPtr := sub(posOfMetadataSize, size)
    data := mload(64)
    // increment free memory pointer by metadata size + 32 bytes (length)
    mstore(64, add(data, add(size, 32)))
    mstore(data, size)
    let memPtr := add(data, 32)
    calldatacopy(memPtr, dataPtr, size)
  }
  return abi.decode(data, (address, uint256, uint256[]));
}
```

This snippet is a mix of Solidity and Yul, so it is easier to read, but we will
still go through it line by line to complete the breakdown of the standard.

The first two lines are used to know the length of the metadata. This is done
using the `calldataload()` function from Yul, which loads the 32 bytes following
a specified offset.

Then we compute the `dataPtr` variable which allow to point to the start of the
metadata in the calldata. Next, we load the free memory pointer located at the
memory address `0x40`, or `60` in decimals. So the variable `data` will contain
the position to the first free slot in memory.

Subsequently, we update the free memory pointer to point to a slot that is the
current free pointer plus the slots required for the metadata and the metadata
length. At this point, we have a numbers of free slots before the free memory
pointer that is enough for us to store the metadata length, and its value. We
then store the length and copy the data from calldata.

The final part in the return, is showing a specific case in which the metadata
was the packed information of `(address, uint, uint[])`.

A more generic case would be this:

```solidity
function getMetadata() internal pure returns (bytes memory) {
bytes memory data;
assembly {
  // Same yul code of previous snippet
}
return data;
}
```

Since the function is internal, the memory is not cleaned, and we return a
pointer to the memory slot containing the length of the metadata. This way we
can have the getter generic and handle the metadata from the return of the
function.
