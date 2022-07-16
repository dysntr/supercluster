export default function ConnectWallet(props) {
  return (
    <div>
      <h1>Connect Wallet screen</h1>
      <button className="waveButton" onClick={props.connectWallet}>
        Connect Wallet
      </button>
    </div>
  )
}