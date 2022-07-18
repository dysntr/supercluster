import { Link } from "react-router-dom";
import styled from "styled-components";
import { MainContainer } from "../App";

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const HeaderButton = styled.button`
  color: white;
  margin-left: 2em;
  border: none;
  background-color: #262833;
  border-radius: none;
`;

const StyledLink = styled(Link)`
  margin-top: 2em;
  color: white;
  margin-right: 2em;
`;

const Header = styled.h1`
  margin-bottom: 2px;
  font-size: 48px;
`;

const Text = styled.p`
  margin-top: 0.25em;
  margin-bottom: 0.25em;
`;

const Address = styled.button`
  background: rgba(100, 100, 100, 0.2);
  color: #a2c5fd;
  text-align: center;
  border-radius: 0.5em;
  border: none;
`;

const NavContainer = styled.nav`
  display: flex;
  width: 100%;
  margin-top: 2em;
  justify-content: center;
  border-bottom: 1px solid white;
`;

const NavLink = styled(Link)`
  color: #b8c4d6;
  text-decoration: none;
  margin-bottom: 1em;
  font-size: 28px;
  font-weight: 700;
  min-width: 20em;
  text-align: center;
`;

export default function Navigation(props) {
  const walletAddress = props.walletAddress;
  const walletStart = walletAddress.slice(0, 2);
  const walletEnd = walletAddress.slice(35, 40);
  const walletTruncated = walletStart + "    ...    " + walletEnd;

  return (
    <>
      <HeaderContainer>
        <HeaderButton>Refresh</HeaderButton>
        <Header>👽 Supercluster</Header>
        <StyledLink to="/settings">settings</StyledLink>
      </HeaderContainer>
      <Text>Connected with:</Text>
      <Address>{walletTruncated}</Address>
      <NavContainer>
        <NavLink to="/">Followed NFTs</NavLink>
        <NavLink to="/created">Created NFTs</NavLink>
        <NavLink to="/data">All</NavLink>
      </NavContainer>
    </>
  );
}
