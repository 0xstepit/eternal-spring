---
author: Stefano Francesco Pitton
title: "Cosmos SDK ABCI"
slug: "cosmos-sdk-abci"
tags: []
related: []
created: 2025-07-29
modified: 2025-11-09
to-publish: false
---

# Cosmos SDK ABCI

The output of the consensus is the list of transaction in a block. With the
ABCI, the application interacts with the consensus only at decision time.
Allowing the app to communicate with the consensus before this phase allows for
many optimization, such state transition proofs.

With ABCI++, the app can interact with the consensus in three phases:

- A new proposal is to be created - `PrepareProposal`: only block proposer.
- A new proposal is to be validated - `ProcessProposal`: all validators.
- At the moment a vote is sent or received (pre-commit) - `ExtendVote`,
  `VerifyVoteExtension`.

The `FinalizeBlock` method is called all the time to decide for a block.

## Consensus Phases

1. The block proposer (proposer process) calls `PrepareProposal`.
2. All processes call `ProcessProposal` and return a response.
3. All processes call `ExtendVote`.
4. `VerifyVoteExtension` is called $n-1$ times were $n$ is the number of
   validator processes.
5. All processes call `FinalizeBlock`.
6. All processes call `Commit`.

CometBFT is a client and the Application is the server.

## Methods

- `PrepareProposal`: CometBFT create a **raw proposal** getting txs from the
  mempool and then call the `RequestPrepareProposal`. The application receive
  the raw proposal and can perform changes. The application returns the
  **prepared proposal**. This phase can be non deterministic.
- `ProcessProposal`: This method is called when CometBFT has the proposal and
  the value of `isValid` is `nil`. The application can reject the block, but as
  a general rule should always accept it and ignore the invalid parts.
- `ExtendVote`: Allows validator to do more than just validation adding to the
  pre-commit (last round of voting) additional data in a non deterministic way.
  The data added is called **vote extension**. The data here will be made
  available the next height. If there are no extensions to the vote, the
  application returns an empty slice of bytes. This method is called only if the
  pre-commit message is not nil.
- `VerifyVoteExtension`: Allows validators to verify the vote extension in the
  pre-commit message. If the validation fails, the message is ignored by the
  consensus. Also in this case, the best practice is that the app should accept
  the extension and ignore it later.

## Deterministic state machine

The response of the application is included in the header of the next block. The
state of an application should change only based on the input of the
`FinalizeBlock` request.

Vote extension requests must never have side effects on the application state.

## Random

During the `PrepareProposal` it is possible to add transactions to the block,
potentially from the vote extension of the previous block.

`FinalizeBlock` ignores any byte slice that does not implement the `sdk.Tx`
interface.
