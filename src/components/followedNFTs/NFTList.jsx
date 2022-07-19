import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fakeNFTs } from "../../fakeNFTs";

const NFT = styled.div`
  width: 280px;
  height: auto;
  margin: 3em;
  text-align: center;
`;

const NFTImg = styled.img`
  width: 100%;
  height: auto;
  border-radius: 2em;
  box-shadow: -12px -12px 34px #1a1b22, 12px 12px 34px #3e4154;
`;

const NFTTitle = styled.h3`
  font-size: 20px;
  color: white;
`;

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

const NFTList = (props) => {
  // const userNFTs = props.userNFTs;

  const MappedNFTs = fakeNFTs.map((nft, i) => {
    return (
      <Link
        to={{ pathname: `/nft/${nft.contractAddr}` }}
        state={{
          nft: nft,
        }}
        key={i}
      >
        <NFT>
          <NFTImg src={nft.NFTImg} />
          <NFTTitle>{nft.NFTTitle}</NFTTitle>
        </NFT>
      </Link>
    );
  });

  return <List>{MappedNFTs}</List>;
};

export default NFTList;
