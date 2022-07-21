export async function getNFTs(Web3Api, currentAccount, contractAddress) {
  const options = {
    chain: "polygon",
    address: currentAccount,
    token_address: contractAddress,
  };

  try {
    const superclusterNFTs = await Web3Api.account.getNFTsForContract(options);

    if (superclusterNFTs.result.length > 0) {
      let nft_metadata = superclusterNFTs.result[0].metadata;

      let name_regex = /"name\":\"([\w \s]+)\"/i;
      let name_match = name_regex.exec(nft_metadata);

      let description_regex = /"description\":\"([\w \s .']+)\"/i;
      let description_match = description_regex.exec(nft_metadata);

      let image_regex = /ipfs:\/\/\w+/i;
      let image_match = image_regex.exec(nft_metadata);

      let tbaRegex = /TBA\",\"value\":\"(0x\w{40})/i;
      let tba_match = tbaRegex.exec(nft_metadata);

      let nftObject = {
        NFTTitle: name_match[1],
        NFTImg: image_match[0],
        NFTDescription: description_match[1],
        contractAddr: contractAddress,
        trustedAddr: tba_match[1],
        pinData: [],
      };

      return nftObject;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
  }
}

export async function getCreatedNFTs(Web3Api, walletAddress) {
  walletAddress = "0xd69DFe5AE027B4912E384B821afeB946592fb648";
  const options = {
    address: walletAddress,
    chain: "polygon",
  };

  let createdNFTs = [];

  const NFTs = await Web3Api.account.getNFTs(options);
  //console.log(NFTs);
  if (NFTs.result.length > 0) {
    NFTs.result.forEach((result) => {
      let nft_metadata = result.metadata;
      if (nft_metadata && nft_metadata.includes(walletAddress)) {
        createdNFTs.push(result);
      }
    });
    return createdNFTs;
  } else {
    return null;
  }
}

export async function getNFTOwners(Web3Api, contractAddress) {
  const options = {
    address: contractAddress,
    chain: "polygon"
  };
  const nftOwners = await Web3Api.token.getNFTOwners(options);

  let nftOwnersAddresses = [];
  if (nftOwners && nftOwners.result.length > 0) {
    nftOwners.result.forEach((nftOwner) => {
      nftOwnersAddresses.push(nftOwner.owner_of);
    })
    return nftOwnersAddresses;
  } else {
    return null
  }
}