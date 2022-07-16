import { Link } from "react-router-dom"

export default function Navigation(props) {
  const walletAddress = props.walletAddress;

  return (
    <div>
      <h1>Supercluster</h1>
      <div>
        <p>Connected address: {walletAddress}</p>
      </div>
      <nav>
        <Link to="/">Followed NFTs</Link>
        <Link to="/created">Created NFTs</Link>
        <Link to="/data">All Data</Link>
      </nav>
    </div>
  )
}