import { Link } from "react-router-dom";

export default function Home(props) {
  const walletAddress = props.walletAddress;
  const allMessages = props.allMessages;

  return (
    <div>
      <h1>Supercluster</h1>
      <div>
        <body>Connected address: {walletAddress}</body>
      </div>
      <nav>
        
      </nav>
      <div>
        {allMessages.map((message, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: "OldLace",
                marginTop: "16px",
                padding: "8px",
              }}
            >
              <div>Sender: {message.Sender}</div>
              <div>Message Hash: {message.Hash}</div>
              <div>Message: {message.Content}</div>
            </div>
          );
        })}
      </div>
    </div>
  )
}