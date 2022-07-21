import React, { useEffect, useState } from "react";
import { colorLog } from "../utils/Misc.js";
import NFTList from "../components/NFTs/NFTList.jsx";
import SectionLoading from "../components/SectionLoading.jsx";

export default function Created({ walletAddress, web3Api }) {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getCreatedNFTs(Web3Api, walletAddress) {
      walletAddress = "0xd69DFe5AE027B4912E384B821afeB946592fb648";
      const options = {
        address: walletAddress,
        chain: "polygon",
      };

      let createdNFTs = [];

      const NFTs = await Web3Api.account.getNFTs(options);
      if (NFTs.result.length > 0) {
        NFTs.result.forEach((result) => {
          let nft_metadata = result.metadata;
          if (nft_metadata && nft_metadata.includes(walletAddress)) {
            const metaData = JSON.parse(nft_metadata);
            const contractAddr = metaData.attributes[0].value;
            metaData["contractAddr"] = contractAddr;

            //removes duplicate attributes section
            delete metaData.attributes;
            console.log(metaData);
            createdNFTs.push(metaData);
          }
        });
        setIsLoading(false);
        setNfts(createdNFTs);
      } else {
        console.log(colorLog(1, "Error retreiving created NFTs"));
      }
    }
    getCreatedNFTs(web3Api, walletAddress);
  }, [web3Api, walletAddress]);

  console.log("Created Page", nfts);

  if (isLoading) {
    return <SectionLoading />;
  }

  return <NFTList nftList={nfts} isCreator={true} />;
}
