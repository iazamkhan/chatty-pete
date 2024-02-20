import Head from "next/head";
import { ChatSidebar } from 'components/ChatSidebar'
import { useState } from "react";
import { streamReader } from "openai-edge-stream";
import { v4 as uuid } from "uuid"
import Message from "components/Message";

export default function ChatPage() {

  const [messageText, setMessageText] = useState("")
  const [incomingMessage, setIncomingMessage] = useState("")
  const [newChatMessages, setNewChatMessages] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNewChatMessages(prev => {
      const newChatMessages = [...prev, {
        _id: uuid(),
        role: "user",
        content: messageText,
      }]
      return newChatMessages;
    })
    console.log("messageText", messageText)
    const response = await fetch('/api/chat/sendMessage', {
      method: "POST",
      stream: true,
      headers: {
        contentType: "application/json"
      },
      body: JSON.stringify({ message: messageText }),
    });
    const data = response.body;
    if (!data) {
      console.log("no data")
    }
    const reader = data.getReader();
    setIncomingMessage("This is a dummy reply from ChatGPT");
    await streamReader(reader, (message) => {
      console.log("Message: ", message);
      setIncomingMessage(s => `${s}${message.content}`);
    })
  }

  return (
    <>
      <Head>
        <title>New chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar />
        <div className="bg-gray-700 flex flex-col">
          <div className="flex-1 text-white">{newChatMessages.map(message => <Message key={message._id} role={message.role} content={message.content} />)}{incomingMessage && <Message role="assistant" content={incomingMessage} />}</div>
          <footer className="bg-gray-800 p-10">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2">
                <textarea value={messageText} onChange={e => setMessageText(e.target.value)} placeholder="Send a message..." className="w-full resize-none p-2 rounded-md bg-gray-700 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500" />
                <button type="submit" className="btn">Send</button>
              </fieldset>
            </form>
          </footer>
        </div>
      </div>
    </>
  );
}
