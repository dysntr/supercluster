import { colorLog } from "./Misc";

/**
 * getCurrentUserNFTs utility function
 * This function will get the metadata for NFTs of the current user
 * Based on the metadata it will figure out if the current user is the trusted broadcast address for an NFT they hold
 * It will compile a list of compatible NFTs (ex. ones that have TBA attribute)
 * This function will return a NFTsArray of all the compatible NFTs for the current user
 **/
export async function getCurrentUserNFTs(
  Web3Api,
  currentAccount,
  contractAddresses
) {
  let nftArray = [];

  let processedNFT = [];
  let trustedAddresses = [];

  try {
    colorLog(1, "Entering getCurrentUserNFTs");

    for (const token of contractAddresses) {
      //if user holds multiple of the same token, skip
      if (processedNFT.includes(token)) {
        colorLog(2, "Skipping duplicate token", token);
        continue;
      }

      const options = {
        chain: "polygon",
        address: currentAccount,
        token_address: token,
      };
      colorLog(3, "Getting NFTMetadata for token", token);

      const nftsForContract = await Web3Api.account.getNFTsForContract(options);
      console.log(nftsForContract);
      if (nftsForContract.result.length > 0) {
        let nft_metadata = nftsForContract.result[0].metadata;

        let name_regex = /"name\":\"([\w \s]+)\"/i;
        let name_match = name_regex.exec(nft_metadata);

        let description_regex = /"description\":\"([\w \s .']+)\"/i;
        let description_match = description_regex.exec(nft_metadata);

        let image_regex = /ipfs:\/\/\w+/i;
        let image_match = image_regex.exec(nft_metadata);

        let tbaRegex = /TBA\",\"value\":\"(0x\w{40})/i;
        let tba_match = tbaRegex.exec(nft_metadata);

        console.log("tba_match", tba_match);

        let nftObject;

        if (tba_match.length === 2) {
          colorLog(2, "MetaData found for token,name", token, name_match[1]);

          if (trustedAddresses.includes(tba_match[1].toLowerCase())) {
            colorLog(2, "Found duplicate TBA, skipping token", token);
            continue;
          }

          trustedAddresses.push(tba_match[1].toLowerCase());
          let isCreator = false;

          if (tba_match[1].toLowerCase() == currentAccount.toLowerCase()) {
            isCreator = true;
          }

          nftObject = {
            NFTTitle: name_match[1],
            NFTImg: image_match[0],
            NFTDescription: description_match[1],
            contractAddr: token.toLowerCase(),
            trustedAddr: tba_match[1].toLowerCase(),
            isCreator: isCreator,
            pinData: [],
          };

          processedNFT.push(token.toLowerCase());
          nftArray.push(nftObject);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  console.log("processedNFT", processedNFT);
  console.log("nftArray", nftArray);
  colorLog(1, "Exiting getCurrentUserNFTs");

  return nftArray;
}

/** DEPRECATED
 **/
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

/**
 * getNFTOwners utility function
 * This function will get a list of NFT holders for a specific NFT (contract address)
 **/
export async function getNFTOwners(Web3Api, contractAddress) {
  const options = {
    address: contractAddress,
    chain: "polygon",
  };
  const nftOwners = await Web3Api.token.getNFTOwners(options);

  let nftOwnersAddresses = [];
  if (nftOwners && nftOwners.result.length > 0) {
    nftOwners.result.forEach((nftOwner) => {
      nftOwnersAddresses.push(nftOwner.owner_of);
    });
    return nftOwnersAddresses;
  } else {
    return null;
  }
}
