---
author: Stefano Francesco Pitton
title: IBC denom
slug: ibc-denom
aliases: []
tags: []
related: []
created: 2024-10-28
modified: 2025-11-09
to-publish: false
---

# IBC denom

## Data

```go
type Packet struct {
	// number corresponds to the order of sends and receives, where a Packet
	// with an earlier sequence number must be sent and received before a Packet
	// with a later sequence number.
	Sequence uint64
	// identifies the port on the sending chain.
	SourcePort string
	// identifies the channel end on the sending chain.
	SourceChannel string
	// identifies the port on the receiving chain.
	DestinationPort string
	// identifies the channel end on the receiving chain.
	DestinationChannel string
	// actual opaque bytes transferred directly to the application module
	Data []byte
	// block height after which the packet times out
	TimeoutHeight types.Height
	// block timestamp (in nanoseconds) after which the packet times out
	TimeoutTimestamp uint64
}
```

## Check if receiver is source chain

We check if the string:

```go
fmt.Sprintf("%s/%s/", portID, channelID)
```

Is the prefix of the `Denom` field contained in the IBC packet data. This is because the
string `portID/channelID` uniquely identify a connection of the source chain and the destination
chain. For example, chain A, can have two IBC connections with two different chains:

- With chain B: `portB/channelB`.
- With chain C: `portC/channelC`.

Let's assume chain A receives the native token of chain B, it will be something
like `portB/channelB/denomB`. Now, we should consider two cases.

- Chain A transfer to B: when chain A wants to transfer the token to chain B, in the IBC packet,
  it will populate the fields `SourcePort` and `SourceChannel` with respectively `portB`
  and `channelB`.

- Chain A transfer to C: when chain A wants to transfer the token to chain C, in the IBC packet,
  it will populate the fields `SourcePort` and `SourceChannel` with respectively `portC` and
  `channelC`.

Since the check if the destination chain is the source chain is made using these two packet
fields, it will return true for chain B and false for chain C.

## Destination is token source

### Single and multi hop

After receiving the packets, the destination chain compute the unprefixed denom by removing
the `portID/channelID` from the `Denom`. At this point, it is checked if the unprefixed denom
contains information of other IBC path. This is verified by checking if the unprefixed denom
contains other `/` characters in the string. The reason is pretty simple, let's consider a
token native of chain C that has been sent to Chain A and then to chain B. When chain B send back the
token to A, it will be represented in the following way:

- Prefixed denom: `portBA/channelBA/portAC/channelAC/denomC`
- Unprefixed denom: `portAC/channelAC/denomC`

Since the unprefixed denom contains other IBC traces, it means that on chain B, it was arrived
through multiple hops.

```go
type DenomTrace struct {
	// path defines the chain of port/channel identifiers used for tracing the
	// source of the fungible token.
	Path string
	// base denomination of the relayed fungible token.
	BaseDenom string
}
```
