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

const NFTList = ({ nftList, isCreator }) => {
  console.log(colorLog(2, "From NFTList", nftList));

  const MappedNFTs = nftList.map((nft) => {
    return (
      <NFTLink
        key={nft.contractAddr}
        to={{
          pathname: isCreator
            ? `/nft/manage/${nft.contractAddr}`
            : `/nft/${nft.contractAddr}`,
        }}
        state={{
          nftObj: { nft },
        }}
      >
        <NFTGeneral nft={nft} />
      </NFTLink>
    );
  });

  return <List>{MappedNFTs}</List>;
};

export default NFTList;
