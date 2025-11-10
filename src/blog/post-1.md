---
author: Stefano Francesco Pitton
title: "Noble local testing"
slug: "noble-local-testing"
tags: []
related: []
created: 2025-08-21
modified: 2025-11-08
to-publish: false
---

# Noble local testing

This guide walks you through setting up a local Noble blockchain node for
testing purposes using **state sync** to quickly sync with the existing network.

## Installation

Install the Noble binary of the current mainnet/testnet version:

```sh
make install
```

## Configuration Setup

Navigate to the binary configuration directory in your home folder
(`~/.noble/config`) and open the `config.toml` configuration file.

If you don't have this folder, you can quickly create it by executing the
`nobled` binary created in the `./build/` folder of the Noble repo:

```sh
./build/nobled start
```

Notice that depending on the starting state you want to simulate the upgrade
against to, you should get the proper geneiss and rpc endpoints which should be
mainnet or testnet.

## Configure state sync

State sync allows your node to quickly sync to the current blockchain state
without downloading and replaying the entire blockchain history.

Locate the state sync section in your CometBFT config file:

```toml
#######################################################
###         State Sync Configuration Options        ###
#######################################################
[statesync]
```

Enable state sync and configure the required fields:

```toml
enable = true

rpc_servers = "https://noble-rpc.polkachu.com:443,https://noble-rpc.polkachu.com:443"
trust_height = 33245000
trust_hash = "EA1D1486F2C7A45532A1BF92E59925C5410EB7E514BEB48F6B58792BD0B516BF"
```

**Important:**

- `trust_height`: The block height from which your node starts trusting the
  blockchain state
- `trust_hash`: The corresponding block hash for the trust height
- These values should be updated to recent block heights for optimal sync
  performance. Polkachu recommends to use <CURRENT_BLOCK> - 2000.

## Configure P2P

Peer-to-peer (P2P) configuration enables your node to connect to other nodes in
the Noble network.

Locate the P2P section in your config file:

```toml
#######################################################
###           P2P Configuration Options             ###
#######################################################
[p2p]
```

Configure the seed nodes from which your node will discover peers and receive
blockchain state:

```toml
seeds = "ade4d8bc8cbe014af6ebdf3cb7b1e9ad36f412c0@seeds.polkachu.com:21556"
```

**Note:** Seeds are bootstrap nodes that help your node discover other peers in
the network.

## Configure the genesis file

Download and install the genesis file from a trusted source, which contains the
initial state of the Noble blockchain:

```sh
wget -O genesis.json https://snapshots.polkachu.com/genesis/noble/genesis.json --inet4-only
mv genesis.json ~/.noble/config
```

## Start the sync process

Start your Noble node to begin the state sync process:

```sh
nobled start
```

The node will begin discovering and downloading snapshots. You'll see output
similar to:

```sh
10:30AM INF Discovering snapshots discoverTime=15000 module=statesync

...

10:30AM INF Discovered new snapshot format=3 hash=9EE06A7B2E3E08BBCE32C4C01FD74D8D1EE050B35835C1AE10800260079AFD47 height=33294500 module=statesync
10:30AM INF Discovered new snapshot format=3 hash=FF74945E3EFA2FBBB967682A679857E83A0AEA33FA46D51CDE3F5C6D805AAB49 height=33294000 module=statesync
10:30AM INF Discovered new snapshot format=3 hash=C8C34E2650ED223FD6DA4B41764EF861CB3D701ADADC41B809745955DAEA8390 height=33292000 module=statesync
10:30AM INF Discovered new snapshot format=3 hash=ACEA7351B65999B033BED9409FD831556B108D2C1D8D466352830D9B0B4DD55C height=33290000 module=statesync
10:30AM INF Discovered new snapshot format=3 hash=9F4B6803264D71E56561201CECB399A1032310A189D32B8554277B3B7C11A13C height=33288000 module=statesync

...

10:30AM INF Applied snapshot chunk to ABCI app chunk=1 format=3 height=33294500 module=statesync total=16
10:30AM INF Applied snapshot chunk to ABCI app chunk=2 format=3 height=33294500 module=statesync total=16
10:30AM INF Applied snapshot chunk to ABCI app chunk=3 format=3 height=33294500 module=statesync total=16
10:30AM INF Applied snapshot chunk to ABCI app chunk=4 format=3 height=33294500 module=statesync total=16
10:30AM INF Fetching snapshot chunk chunk=9 format=3 height=33294500 module=statesync total=16
10:30AM INF Applied snapshot chunk to ABCI app chunk=5 format=3 height=33294500 module=statesync total=16

...

10:32AM INF We need more addresses. Sending pexRequest to random peer module=pex peer="Peer{MConn{51.81.49.59:21556} 3b705bf87940bb7e48da61587e6e2790d34f75e7 out}"
10:32AM INF service start impl="Peer{MConn{95.217.119.118:31656} 08e793f27136816af92719d88155e2d6c08cb864 out}" module=p2p msg="Starting Peer service" peer=08e793f27136816af92719d88155e2d6c08cb864@95.217.119.118:31656
10:32AM INF service start impl=MConn{95.217.119.118:31656} module=p2p msg="Starting MConnection service" peer=08e793f27136816af92719d88155e2d6c08cb864@95.217.119.118:31656
10:32AM INF Discovered new snapshot format=3 hash=8CC4A2D392FF667E4F592EAB8F369AEE7B7029F355F8390B8D6472A440894E88 height=32187000 module=statesync
```

Once the state sync is complete, Comet will check that the app hash and height
correspond to the trusted values. If this check succeeds, the node will switch
to fast sync and catch up with all blocks after the trusted height.

```sh
10:34AM INF executed block app_hash=9ECCDF1BA28B8755875A12ACE2F4C9D5E85B14461F58DC1E4AC560F6C62403CA height=33294501 module=state
10:34AM ERR failed to add block err="got an already committed block #33294501 (possibly from the slow peer 08e793f27136816af92719d88155e2d6c08cb864)" module=blocksync peer="Peer{MConn{95.217.119.118:31656} 08e793f27136816af92719d88155e2d6c08cb864 out}"
10:34AM INF committed state block_app_hash=60EC37EF40F593061D0E61C751CEF2FACE27453EEC7218CB5D9620E3884BAAE2 height=33294501 module=state
10:34AM INF indexed block events height=33294501 module=txindex
10:34AM INF finalized block block_app_hash=0891AA54D73A2291BA2373ACFD1ABFE30D92B6065FD93A5A6CB26E3DC954FB78 height=33294502 module=state num_txs_res=0 num_val_updates=0
10:34AM INF executed block app_hash=0891AA54D73A2291BA2373ACFD1ABFE30D92B6065FD93A5A6CB26E3DC954FB78 height=33294502 module=state
10:34AM INF committed state block_app_hash=9ECCDF1BA28B8755875A12ACE2F4C9D5E85B14461F58DC1E4AC560F6C62403CA height=33294502 module=state
10:34AM INF indexed block events height=33294502 module=txindex
```

## Create a local testnet

After successfully syncing your node, you can create a local testnet for
development and testing. Remember that the binary must be the same running in
mainnet:

```sh
git checkout main
make build
```

```sh
# Create a backup of your synced node data
cp -r ~/.noble ~/.noble-<HEIGHT>

# Create a testing environment and start the node
rm -rf ~/.noble-testing && cp -r ~/.noble-<HEIGHT> ~/.noble-testing && nobled start --home ~/.noble-testing

# Initialize an in-place testnet (replace <NOBLE_ADDRESS> with your actual Noble address)
./build/nobled in-place-testnet noble-1 <NOBLE_ADDRESS> --home ~/.noble-testing
```

**Parameters:**

- `<HEIGHT>`: Replace with the block height at which you want to create the
  testnet snapshot
- `<NOBLE_ADDRESS>`: Replace with your Noble wallet address that will control
  the testnet

If we want to test an upgrade instead:

```sh
./build/nobled in-place-testnet noble-1 <NOBLE_ADDRESS> --trigger-testnet-upgrade "flux" --home ~/.noble-testing
```

After the node crashes because of the upgrade height, checkout to the binary you
want to run after the upgrade, build it, and run:

```sh
./build/nobled start --home ~/.noble-testing
```

## Troubleshooting

### Reset blockchain data

If you encounter sync issues or want to start fresh, you can reset all
blockchain data:

```sh
nobled comet unsafe-reset-all
```

This command will:

```sh
I[2025-08-21|10:13:44.758] Removed existing address book                file=/Users/stepit/.noble/config/addrbook.json
I[2025-08-21|10:13:45.536] Removed all blockchain history               dir=/Users/stepit/.noble/data
I[2025-08-21|10:13:45.537] Reset private validator file to genesis state keyFile=/Users/stepit/.noble/config/priv_validator_key.json stateFile=/Users/stepit/.noble/data/priv_validator_state.json
```

**Warning:** This command will delete all blockchain data and reset your node to
genesis state. Use with caution.

## Resources

- [Polkachu Seeds](https://www.polkachu.com/seeds/noble)
- [Polkachu State-Sync](https://www.polkachu.com/state_sync/noble)
- [Polkachu Genesis](https://www.polkachu.com/genesis/noble)
- [Cosmos SDK State Sync Guide](https://blog.cosmos.network/cosmos-sdk-state-sync-guide-99e4cf43be2f)
