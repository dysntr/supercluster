import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fakeNFTs } from "../../fakeNFTs";
import ContentDetails from "./ContentDetails";
import NFTGeneral from "./NFTGeneral";

const AllDataSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Menu = styled.div`
  padding: 1em 2em;
  width: 85%;
`;

const BackLink = styled(Link)`
  border: none;
  color: white;
  background-color: #262833;
  border-bottom: 1px solid white;
`;

const NFTContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 85%;
  margin: 2em;
`;

const ContentInfo = styled.div`
  flex-grow: 1;
  margin: 0 2em 2em 2em;
`;

const ALLNFTs = fakeNFTs.map((nft) => {
  console.log(nft);
  return (
    <NFTContainer>
      <NFTGeneral nft={nft} />
      <ContentInfo>
        <ContentDetails contentArray={nft.pinData} />
      </ContentInfo>
    </NFTContainer>
  );
});

export const AllNFTData = ({ nft }) => {
  return (
    <AllDataSection>
      <Menu>
        <BackLink to="/">Home</BackLink>
      </Menu>
      {ALLNFTs}
    </AllDataSection>
  );
};
