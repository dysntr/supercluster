import styled from "styled-components";

const CreatedDiv = styled.div`
  color: white;
  width: 100%;
  min-height: 20vh;
  display: flex;
  justify-content: center;
`;

export default function Created() {
  return (
    <>
      <CreatedDiv>Created NFTs</CreatedDiv>
      <CreatedDiv>Created NFTs</CreatedDiv>
    </>
  );
}
