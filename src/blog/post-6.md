---
author: Stefano Francesco Pitton
title: CCTP
slug: cctp
tags: [stablecoin, blockchain]
related: []
created: 2025-01-23
modified: 2025-07-09
to-publish: false
---

# CCTP

CCTP is a generalized message passing protocol used for both EVM and non EVM
chains. This allows to transfer USDC across different chain, referred by the
protocol al **domains**.

An app request Circle to sign, off-chain, an attestation of transfer. Circle
sign the attestation. An app on another chain receives the message and act
accordingly. These applications are called **on-chain components**

The attestation service is called **Iris** and is based on events emitted by the
chain. So, when a user wants to transfer USDC from one chain to another, it has
to send a request to the component called `TokenMessenger` contract, which:

- Burn the coins
- Emit the event

Iris sign the attestation and nother element called API consumer commit this
attestation to the receiving chain.

On the receiving chain, tokens are minted and also in this case an event is
emitted.

Being a protocol, the
[message format](https://developers.circle.com/stablecoins/message-format) is
specified by Circle.

## References

1. [CCTP Getting Started](https://developers.circle.com/stablecoins/cctp-getting-started)
