---
author: Stefano Francesco Pitton
title: "Markdown code"
slug: "markdown-code"
tags: ["style", "example", "code"]
related: []
created: 2025-08-21
modified: 2025-11-29
to-publish: false
---

# Markdown code

## Golang

```go {title="Orbiter Keeper definition"}
var _ types.Authorizer = &Keeper{}

// Keeper is the main module keeper.
type Keeper struct {
	cdc          codec.Codec
	logger       log.Logger
	eventService event.Service

	// authority represents the module manager.
	authority string

	// Each component manages its own state.
	executor   *executorcomp.Executor
	forwarder  *forwardercomp.Forwarder
	dispatcher *dispatchercomp.Dispatcher
	adapter    *adaptercomp.Adapter
}
```

## Rust

```rust
/// Instance of `simplex` consensus engine.
pub struct Engine<
    E: Clock + GClock + Rng + CryptoRng + Spawner + Storage + Metrics,
    P: PublicKey,
    S: Scheme<PublicKey = P>,
    B: Blocker<PublicKey = P>,
    D: Digest,
    A: Automaton<Context = Context<D, P>, Digest = D>,
    R: Relay<Digest = D>,
    F: Reporter<Activity = Activity<S, D>>,
> {
    context: ContextCell<E>,

    voter: voter::Actor<E, P, S, B, D, A, R, F>,
    voter_mailbox: voter::Mailbox<S, D>,

    batcher: batcher::Actor<E, P, S, B, D, F>,
    batcher_mailbox: batcher::Mailbox<S, D>,

    resolver: resolver::Actor<E, P, S, B, D>,
    resolver_mailbox: resolver::Mailbox<S, D>,
}
```

## Solidity

```solidity
import { IFiatToken, IMessageTransmitter, ITokenMessenger } from "./interfaces/Circle.sol";

/**
 * @title OrbiterGatewayCCTP
 * @author Noble Team
 * @notice Allows to initiate a metadata extended CCTP token transfer to the Noble Orbiter module.
 */
contract OrbiterGatewayCCTP {
    /// @notice Thrown when the address of the token to transfer is the zero address.
    error ZeroTokenAddress();

    /**
     * @notice Emitted when the deposit for burn and the general message
     * passing are executed successfully.
     * @param transferNonce Nonce of the CCTP deposit for burn message.
     * @param payloadNonce Nonce of the GMP message containing the payload hash.
     */
    event DepositForBurnWithOrbiter(uint64 indexed transferNonce, uint64 indexed payloadNonce);

    /// @notice Token transferred to the Orbiter
    IFiatToken public immutable TOKEN;
    /// @notice The only address allowed to complete the transfer
    /// on the receiving chain
    bytes32 public immutable DESTINATION_CALLER;

    /**
     * @notice Initialize the OrbiterGatewayCCTP contract.
     * @param token_ Address of the token to transfer.
     * @param tokenMessenger_ Address of the CCTP TokenMessenger contract.
     * @param destinationCaller_ Address of the relayer that will complete the transfer to the
     * Noble chain. The destination caller is required in the constructor because the relayer
     * must be able to group CCTP transactions before relaying them to Noble.
     */
    constructor(address token_, address tokenMessenger_, bytes32 destinationCaller_) {
        if (token_ == address(0)) revert ZeroTokenAddress();
        if (destinationCaller_ == bytes32(0)) revert ZeroDestinationCaller();

        TOKEN = IFiatToken(token_);

        DESTINATION_CALLER = destinationCaller_;
    }
}
```
