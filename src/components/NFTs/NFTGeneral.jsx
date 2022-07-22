import React from "react";
import styled from "styled-components";

const NFT = styled.div`
  width: 280px;
  height: auto;
  text-align: center;
`;

const NFTImg = styled.img`
  width: 100%;
  height: auto;
  border-radius: 2em;
  box-shadow: -12px -12px 34px #1a1b22, 12px 12px 34px #3e4154;
  overflow: hidden;
  border-radius: 50%;
`;

const NFTTitle = styled.h3`
  font-size: 20px;
  color: white;
`;

const NFTGeneral = ({ nft }) => {
  const ipfsImg = nft.NFTImg.replace("ipfs://", "https://ipfs.io/ipfs/");
  return (
    <NFT key={nft.NFTTitle}>
      <NFTImg src={ipfsImg} alt={nft.NFTTitle} />
      <NFTTitle>{nft.NFTTitle}</NFTTitle>
    </NFT>
  );
};

export default NFTGeneral;
