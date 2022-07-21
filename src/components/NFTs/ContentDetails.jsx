import React from "react";
import styled from "styled-components";

const DetailsBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  margin: 0 2em 2em 2em;
  display: flex;
  background-color: #3e3f4b;
  border-radius: 3em;
  box-shadow: -12px -12px 34px #1a1b22, 12px 12px 34px #3e4154;
`;

const DetailGridTitle = styled.div`
  width: 90%;
  color: white;
  border-bottom: 2px solid white;
  display: flex;
  padding: 0 1em;
  justify-content: space-between;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
  margin: 0.5em 1em;
  color: white;
`;

const ContentDetails = ({ contentArray }) => {
  const mappedContent = contentArray.map((content) => {
    return (
      <Content key={content.CID}>
        <p>{content.subject}</p>
        <p>{content.CID}</p>
        <p>{content.date}</p>
      </Content>
    );
  });
  return (
    <DetailsBox>
      <h4>Pinned Files</h4>
      <DetailGridTitle>
        <p>Subject</p>
        <p>CID</p>
        <p>Upload Date</p>
      </DetailGridTitle>
      {mappedContent}
    </DetailsBox>
  );
};

export default ContentDetails;
