import { Link } from "react-router-dom"
import styled from "styled-components";

const HeaderContainer = styled.div`
  margin-bottom: 56px;
`

const Address = styled.span`
  background: rgba(100, 100, 100, 0.2);
  color: #A2C5FD;
  padding: 8px 24px;
  border-radius: 16px;
`

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  margin: 0 20%;
`

export default function Navigation(props) {
  const walletAddress = props.walletAddress;

  return (
    <div>
      <HeaderContainer>
        <h1>👽 Supercluster</h1>
        <p>Connected address:</p>
        <Address>{walletAddress}</Address>
      </HeaderContainer>
      <NavContainer>
        <Link to="/">Followed NFTs</Link>
        <Link to="/created">Created NFTs</Link>
        <Link to="/data">All Data</Link>
      </NavContainer>
    </div>
  )
}