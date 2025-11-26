import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import './ChatBot.scss';
import Header from '../../components/Header';

const MODEL_NAME = 'gemini-2.0-flash';

const API_KEY = 'AIzaSyC2SyJOubllAJmEFaDvJ-rnDwKJYEUY5os'; 

function GeminiChat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatContainerRef = useRef(null);

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  useEffect(() => {
    // Scroll to bottom when chat history changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isBotTyping]);

  const sendMessage = async () => {
    if (userInput.trim() === '') return;
    
    if (!API_KEY) {
        alert("Please set your Gemini API Key in the code or .env file.");
        return;
    }

    setIsLoading(true);
    setIsBotTyping(true);
    
    console.log("Using model:", MODEL_NAME);

    // Add user message to history immediately for UI feedback
    const newHistory = [...chatHistory, { role: 'user', message: userInput }];
    setChatHistory(newHistory);
    const currentInput = userInput;
    setUserInput('');

    try {
      const chat = model.startChat({
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
        history: chatHistory.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.message }],
        })),
      });

      const result = await chat.sendMessage(currentInput);
      const response = result.response;
      const text = response.text();

      setChatHistory([...newHistory, { role: 'model', message: text }]);
    } catch (error) {
      console.error("Error sending message:", error);
      let errorMessage = "Sorry, something went wrong. Please try again.";
      if (error.message) {
          // Show the actual error message to help debugging
          errorMessage = `Error: ${error.message}`;
      }
      setChatHistory([...newHistory, { role: 'model', message: errorMessage }]);
    } finally {
      setIsLoading(false);
      setIsBotTyping(false);
    }
  };

  return (
    <div className="gemini-chat-page">
      <Header title="Chat with us" subtitle="Enter your queries" />
      <div className="chat-history" ref={chatContainerRef}>
        {chatHistory.map((chat, index) => (
          <div key={index} className={`message ${chat.role}`}>
            <p>{chat.message}</p>
          </div>
        ))}
        {isBotTyping && <div className="message model"><p>Typing...</p></div>}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default GeminiChat;
