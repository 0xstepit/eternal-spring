---
author: Stefano Francesco Pitton
title: Solidity abstract contract
slug: solidity-abstract-contract
summary: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
tags: []
related: []
created: 2024-11-29
modified: 2025-11-29
to-publish: false
---

# Solidity abstract contract

An abstract contract is similar to an interface, but it can contain a mixture of
implemented and unimplemented functions.

You can also mark a contract as abstract when you do not want to create the
contract directly.

```sol
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.9.0;

abstract contract Feline {
    function utterance() public pure virtual returns (bytes32);
}
```

The abstract contract can be used as a base class:

```sol
contract Cat is Feline {
    function utterance() public pure override returns (bytes32) { return "miaow"; }
}
```

The following contract is not marked as virtual because it has a function body,
i.e. `{}`, even though it is not performing anything:

```sol
contract Base {
    function foo() virtual external view {}
}
```

We create an abstract contract when:

- At least one of their functions is not implemented.
- When they don't provides arguments to all their basic contract constructors.
- When we don't want the contract to be created directly.

Interfaces are similar to abstract contracts but they don't have any function
implemented.

```sol
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.2 <0.9.0;

interface Token {
    enum TokenType { Fungible, NonFungible }
    struct Coin { string obverse; string reverse; }
    function transfer(address recipient, uint amount) external;
}
```
