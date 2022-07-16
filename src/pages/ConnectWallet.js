import styled from "styled-components"
import Button from "../components/Button"

const MainContainer = styled.div`
  background-color: #262833;
`

export default function ConnectWallet(props) {
  return (
    <MainContainer>
      <h1>👽 Supercluster</h1>
      <Button onClick={props.connectWallet}>
        Connect Wallet
      </Button>
    </MainContainer>
  )
}