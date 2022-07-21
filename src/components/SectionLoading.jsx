import React from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const LoadingSection = styled.section`
  width: 100%;
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.h2`
  font-size: 24px;
  color: white;
`;

const LoadingGalaxy = styled.div`
  margin-top: 4em;
  width: 300px;
  height: 250px;
  animation: ${rotate} 4s linear infinite;
`;

const SpinningGalaxy = styled.img`
  width: 100%;
  height: auto;
`;

const SectionLoading = () => {
  return (
    <LoadingSection>
      <LoadingText>Searching the clusters for your content...</LoadingText>
      <LoadingGalaxy>
        <SpinningGalaxy
          width="150px"
          height="150px"
          src="./loadingGalaxy.svg"
          alt="spinning galaxy"
        />
      </LoadingGalaxy>
    </LoadingSection>
  );
};

export default SectionLoading;
