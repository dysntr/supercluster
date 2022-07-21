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

const DetailSection = ({ isCreator }) => {
  const location = useLocation();
  // NFT Object is passed through React Router in the state object
  // see the NFT List component for prop passed nftobj
  const { nftObj } = location.state;
  const { nft } = nftObj;

  // temp, need to pull pin data from the state
  const pinData = [
    {
      subject: "JWT galaxies pic",
      CID: "QmedKF9UM2XDEepFZjM2rFZ4hKadTHzbRkeP4Sza2AYNrU",
      date: "07/17/22",
    },
    {
      subject: "JWT blackhole",
      CID: "QmQiu4DowMCdM6H9VDZnPMm6kCCZutqUJUvCAmXzLsqHTH",
      date: "07/17/22",
    },
  ];

  return (
    <NFTSection>
      <Menu>
        <BackLink to={isCreator ? "/created" : "/"} />
      </Menu>
      <NFTContainer>
        <NFTGeneral nft={nft} />
        <ContentInfo>
          {isCreator ? <NewContent /> : null}
          <ContentDetails contentArray={pinData} />
        </ContentInfo>
      </NFTContainer>
    </NFTSection>
  );
};

export default DetailSection;
