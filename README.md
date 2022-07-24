# Supercluster DApp

Supercluster DApp provides a user-friendly interface for content creators and consumers (followers) to share content. The DApp performs IPFS pinning/unpinning orchestration using NFTs, XMTP messaging channel, and an IPFS Node (ex. Brave IPFS Companion). The NFTs are built on Polygon utilizing NFT.Storage for organization and efficiency. Valist is used to distribute the Supercluster DApp.

Followers may own NFTs from various creators. Supercluster minted 4 different NFT collections using Polygon and NFT.Storage. Deployment and minting prices on Polygon were very reasonable. NFT.Storage provided a user-friendly way to upload and organize the NFT files.

Compatible supercluster NFTs have a specific attribute, "TBA" (stands for trusted broadcast address), that provides who is the trusted source of truth for a NFT collection. Typically the TBA is the creator’s wallet address. A creator can use their own NFT contract and add the attribute to become a compatible NFT.

Under the hood, the DAPP allows the TBAs to send out messages to the NFT holders. The followers will only listen for messages from TBAs of NFTs that they own. Currently, the DApp is getting the list of NFT holders and NFT metadata from Moralis.

The followers will automatically pin the content in IPFS that is coming from their NFT content creator (TBA).

The XMTP stack allows us to create an encrypted layer 3 communication channel, that's between ethereum like addresses. This provides a secure communication channel between each individual follower and creator. This is used by the DApp to share CIDs to pin/unpin (orchestrate the pinning/unpinning). It also provides the capability for content creators to share encryption keys for premium content with their followers. The encryption feature will be added in a future release.

Valist is used to distribute the Supercluster DApp.

Supercluster DApp utilizes various existing components in web3, IPFS, XMTP, NFT.Storage, Polygon, Valist to build a user friendly application for content creators and followers to share content.

- Valist: https://app.valist.io/gov218/supercluster
- Supercluster GitHub: https://github.com/dysntr/supercluster
- Supercluster NFT GitHub: https://github.com/dysntr/superclusternft

# Running the DApp

## .env file

You need to create an .env file with your Moralis API keys. Here is an example of an .env file:

```
REACT_APP_MORALIS_API_KEY=
REACT_APP_MORALIS_DAPP_URL=
REACT_APP_MORALIS_APP_ID=
```

## IPFS Node

Install [IPFS Node](https://dist.ipfs.io/#ipfs-update) or use Brave IPFS Companion.

You will need to add the following configuration to the IPFS node (by editing ~/.ipfs/config or under settings):

```
"API": {
    "API": {
      "HTTPHeaders": {
        "Access-Control-Allow-Origin": [
          "http://localhost",
          "http://localhost:3000",
          "http://127.0.0.1"
        ]
      }
```

Or a less restrictive version:

```
"API": {
    "HTTPHeaders": {
      "Access-Control-Allow-Origin": [
        "*"
      ]
    }
  },
```

You can use the following command to clear all existing pins:

```
ipfs pin ls --type recursive -q | xargs ipfs pin rm
```

Currently, the code is configured to use an IPFS node, if you like to use Brave companion, do the following:

In `App.js` in function `connectedIPFS` uncomment the line under `//brave - ...`:

```
//brave - http://localhost:45005/api/v0
//const client = create({ url: "http://localhost:45005/api/v0" });
```

and comment out the line under `//normal ipfs`:

```
//normal ipfs - http://localhost:5001/api/v0
const client = create({ url: "http://localhost:5001/api/v0" });
```

## Creators

You will need to create a Supercluster compatible NFT(S). The NFT will need to have a "TBA" attribute. Refer to https://github.com/dysntr/superclusternft for more details. Distribute your NFT to your followers.

## Followers

Download the DApp, get a free api key from Moralis and configure your IPFS node as stated above.

Get NFT from your favorite content creators.

## Installing, Building and Running the DApp

Run `yarn` to install the dependencies.
Run `yarn build` to build the DApp.
Run `yarn start` to start the DApp.

# Technologies used in this project

- [IPFS](https://ipfs.io/)
- [XMTP](https://xmtp.com/)
- [Polygon Network](https://polygon.technology/)
- [NFT.STORAGE](https://nft.storage/)
- [Vlist](https://app.valist.io/gov218/supercluster)

# Potential Use Cases

- Social Good Warrior
  - For scientists or science-based organizations that want to preserve scientific studies, they can use our service to help pin files, and willing participants can actively join their network to help preserve the content.
- Gaming / Metaverse / DAOs
  - DAOs can incentivize their contributors to help preserve the content and data that the DAO generates and/or relies on.
- Social Media / Network
  - Federated social networks (e.g Mastodon) can use this technology to help decentralize their content, and participants in their network can help uniquely secure their network.

# Next Steps

- Extension support

  - Minimize user friction by just requiring them to install the extension to join the supercluster

- Fluence Integration

  - Replace Moralis API with a Fluence function that queries on-chain data

- Lit Protocol Integration
  - RAllow creators to access control exclusive content for subscribers

# Here are the people who built this project:

- CompositeFellow
  - GitHub: CompositeFellow
- Kaidao
  - GitHub: kaihuang724
  - Twitter: @KaiHuang
- Gov
  - GitHub: govi218
  - Twitter: @\_gov218
- Dysan
  - Github: dysntr
  - Twitter: @dysntr

If you have any questions or feedback, drop us a line!
