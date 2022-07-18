import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
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

const NFTImg = styled.img`
  width: 280px;
  height: auto;
  border-radius: 2em;
`;

const NFTInfo = styled.div`
  display: flex;
  flex-direction: row;
  width: 85%;
`;

const NFTImgContainer = styled.div`
  position: relative;
  margin: 2em;
`;

const FileCount = styled.div`
  height: 2em;
  width: 2em;
  border-radius: 1em;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  top: 16px;
  left: 16px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  margin: 2em;
  display: flex;
  background-color: #3e3f4b;
  border-radius: 3em;
`;

const DetailGridTitle = styled.div`
  width: 90%;
  color: white;
  border-bottom: 2px solid white;
  display: flex;
  padding: 0 1em;
  justify-content: space-between;
`;

const ContentDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
  margin: 0.5em 1em;
  color: white;
`;
const NFTDetail = () => {
  //uses react router to get the state from the link in NFTList component
  const location = useLocation();
  console.log(location.state);
  const { nft } = location.state;
  const pinnedData = nft.pinData.map((file) => {
    return (
      <ContentDetails>
        <p>{file.subject}</p>
        <p>{file.CID}</p>
        <p>{file.date}</p>
      </ContentDetails>
    );
  });
  return (
    <Container>
      <Menu>
        <BackLink to="/">Back</BackLink>
      </Menu>
      <NFTInfo>
        <NFTImgContainer>
          <FileCount>{nft.pinData.length}</FileCount>
          <NFTImg src={nft.NFTImg} />
        </NFTImgContainer>
        <Details>
          <h4>Pinned Files</h4>
          <DetailGridTitle>
            <p>Subject</p>
            <p>CID</p>
            <p>Upload Date</p>
          </DetailGridTitle>
          {pinnedData}
        </Details>
      </NFTInfo>
    </Container>
  );
};

export default NFTDetail;
