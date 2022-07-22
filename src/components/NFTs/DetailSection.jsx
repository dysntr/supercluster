import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import ContentDetails from "./ContentDetails";
import NewContent from "./NewContent";
import NFTGeneral from "./NFTGeneral";

const NFTSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 30vh;
`;

const Menu = styled.div`
  padding: 1em 0;
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
`;

const ContentInfo = styled.div`
  flex-grow: 1;
  margin: 2em;
`;

const DetailSection = ({ isCreatedPage }) => {
  const location = useLocation();
  const { nftObj } = location.state;
  const { nft } = nftObj;

  return (
    <NFTSection>
      <Menu>
        <BackLink to={isCreatedPage ? "/created" : "/"} />
      </Menu>
      <NFTContainer>
        <NFTGeneral nft={nft} />
        <ContentInfo>
          {isCreatedPage ? (
            <NewContent contractAddress={nft.contractAddr} />
          ) : null}
          <ContentDetails contentArray={nft.pinData} />
        </ContentInfo>
      </NFTContainer>
    </NFTSection>
  );
};

export default DetailSection;
