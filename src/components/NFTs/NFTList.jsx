import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { colorLog } from "../../utils/Misc";
import NFTGeneral from "./NFTGeneral";

const List = styled.div`
  width: 100%;
  min-height: 30vh;
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #2c2e3b;
  padding-top: 2em;
`;

const NFTLink = styled(Link)`
  margin: 3em;
`;

const NFTList = ({ nftList, isCreator, isCreatedPage }) => {
  //console.log(colorLog(2, "From NFTList", nftList));
  console.log("nftList", nftList);
  console.log("nftList.typeof", typeof nftList);

  const CreatorNFTs = [];
  const FollowerNFTs = [];

  nftList.map((nft) => {
    console.log("*****nft.isCreator", nft.isCreator);
    if (nft.isCreator) {
      CreatorNFTs.push(nft);
    } else {
      FollowerNFTs.push(nft);
    }
  });

  console.log("*****CreatorNFTs", CreatorNFTs);
  console.log("*****FollowerNFTs", FollowerNFTs);
  const NFTs = isCreatedPage ? CreatorNFTs : FollowerNFTs;
  console.log("*****NFTs", NFTs);
  const MappedNFTs = NFTs.map((nft, i) => {
    return (
      <NFTLink
        key={i}
        to={{
          pathname: nft.isCreator
            ? `/nft/manage/${nft.trustedAddr}`
            : `/nft/${nft.trustedAddr}`,
        }}
        state={{
          nftObj: { nft },
        }}
      >
        <NFTGeneral nft={nft} />
      </NFTLink>
    );
  });
  console.log("*****MappedNFTs", MappedNFTs);
  return <List>{MappedNFTs}</List>;
};

export default NFTList;
