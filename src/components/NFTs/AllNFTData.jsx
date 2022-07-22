import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fakeNFTs } from "../../fakeNFTs";
import { colorLog } from "../../utils/Misc";
import SectionLoading from "../SectionLoading";
import ContentDetails from "./ContentDetails";
import NFTGeneral from "./NFTGeneral";

const AllDataSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 30vh;
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

export const AllNFTData = ({ NFTsArray }) => {
  const ALLNFTs = NFTsArray.map((nft) => {
    return (
      <NFTContainer key={nft.contractAddr}>
        <NFTGeneral nft={nft} />
        <ContentInfo>
          <ContentDetails contentArray={nft.pinData} />
        </ContentInfo>
      </NFTContainer>
    );
  });

  if (!NFTsArray) {
    return <SectionLoading />;
  }

  return (
    <AllDataSection>
      <Menu>
        <BackLink to="/">Home</BackLink>
      </Menu>
      {ALLNFTs}
    </AllDataSection>
  );
};
