export default function Home(props) {
  const allMessages = props.allMessages;

  return (
    <div>
      {allMessages.map((message, index) => {
        return (
          <div
            key={index}
            style={{
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
  )
}