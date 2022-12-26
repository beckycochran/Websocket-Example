import { useEffect, useState } from 'react'
import io from 'Socket.IO-client'
let socket;



const Home = () => {
  const [input, setInput] = useState('')
  const [username, setUsername] = useState('')
  const [chosenUsername, setChosenUsername] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socketInitializer();
    console.log("Socket initializer has run");
  }
    , [])

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io()

    // socket.on('connect', () => {
    //   console.log('connected')
    // })

    // socket.on('update-input', msg => {
    //   setInput(msg)
    // })

    socket.on("newIncomingMessage", (msg) => {
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: msg.author, message: msg.input }
      ])

      console.log(`Messages: ${messages}`)
    })
  }

  const sendMessage = async () => {
    socket.emit("createdMessage", { author: chosenUsername, message });
    setMessages((currentMsg) => [
      ...currentMsg,
      { author: chosenUsername, input }
    ])
  }

  // const onChangeHandler = (e) => {
  //   setInput(e.target.value)
  //   socket.emit('input-change', e.target.value)
  // }

  // return (
  //   <input
  //     placeholder="Type something"
  //     value={input}
  //     onChange={onChangeHandler}
  //   />
  // )

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      if (input) {
        sendMessage()
      }
    }
  }

  return (
    <>
      {!chosenUsername ? (
        <>
          <h3>
            How people should call you?
          </h3>
          <input
            type="text"
            placeholder="Identity..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={() => { setChosenUsername(username) }}>
            Go!
          </button>
        </>
      ) : (
        <>
          <p> 
            Your username: {username}
          </p>
          {messages.map((msg, i) => {
            return (
              <div key={i}>
                {msg.author} : {msg.input}
              </div>
            );
          })}
          <input
            type="text"
            placeholder="New message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={handleKeypress}
          />
          <button
            onClick={() => {
              sendMessage();
            }}
          >
            Send
          </button>
        </>
      )}
    </>
  );
}

export default Home;