import {useEffect, useRef, useState } from 'react';
import ChatbotIcon from './components/ChatbotIcon';
import ChatForm from './components/ChatForm';
import ChatMessage from './components/ChatMessage';


const App = () => {
   const [chatHistory, setChatHistory] = useState([])

   const chatBodyRef = useRef();
   const generateBotResponse = async (history) => {
// Helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [...prev.filter((msg) => msg.text != "Thinking..."), { role: "model", text, isError }]);
    };


    // Format chat history for API request
   history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

       try {
        const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      // Make the API call to get the bot's response
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || "Something went wrong!");
      // Clean and update chat history with bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
       }
       catch (error) {
       updateHistory(error.message, true);
    }
    };
      useEffect(() => {
    // Auto-scroll whenever chat history updates
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="container">
      <div className="chatbot-popup">

        {/*chat header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button className="material-symbols-rounded">
keyboard_arrow_down
</button>

        </div>
        {/* chat body */}
        <div ref={chatBodyRef}  className="chat-body">
          <div className="message bot-message"> 
            <ChatbotIcon />
            <p className="message-text">
              Hey there 👋 <br /> How can i help you today?
            </p>
            </div> 

            
{/* Render the chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat}  />
          ))}
        </div>
{/* chat footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory}   setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  )
}

export default App