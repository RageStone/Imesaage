import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './style.css';

const parseScript = (text) => {
  return text
    .split('\n')
    .map((line, index) => {
      const [sender, ...rest] = line.split(': ');
      if (!sender || rest.length === 0) return null;
      return {
        id: index,
        sender: sender.trim(),
        text: rest.join(': ').trim(),
      };
    })
    .filter((msg) => msg !== null && msg.text.length > 0); // extra filter
};

const ChatBubble = ({ sender, text, isUser }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`chat-bubble ${isUser ? 'user' : 'other'}`}
    >
      {text}
    </motion.div>
  );
};

export default function ChatAnimator() {
  const [inputScript, setInputScript] = useState(
    `p1: Hey, how are you?\np2: I'm good! You?\np1: Doing great. Wanna grab coffee?\np2: Sure! `
  );
  const [messages, setMessages] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [contact, setContact] = useState(`Example`);

  const startAnimation = () => {
    const parsed = parseScript(inputScript);
    setMessages(parsed);
    setDisplayed([]);
    setIsAnimating(true);
  };

  useEffect(() => {
    if (!isAnimating || messages.length === 0) return;
    let i = 0;
    setDisplayed([messages[0]]);

    const interval = setInterval(() => {
      setDisplayed((prev) => [...prev, messages[i]]);
      i++;
      if (i >= messages.length) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isAnimating, messages]);

  return (
    <div className="container">
      <textarea
        value={inputScript}
        onChange={(e) => setInputScript(e.target.value)}
        placeholder="Paste iMessage script: Name: message"
        disabled={isAnimating}
      />
      <textarea
      value= {contact}
      placeholder="Contact name"
      onChange={(e) => setContact(e.target.value)}
      disabled={isAnimating}
      />
      <button onClick={startAnimation} disabled={isAnimating}>
        {isAnimating ? 'Animating...' : 'Start Animation'}
      </button>

      <div className="chat-window">
        <div class="top-bar">
          {' '}
          <button class="back-button" aria-label="Back">
            {' '}
            <svg
              viewBox="0 0 12 20"
              width="12"
              height="20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {' '}
              <path
                d="M10 18L2 10L10 2"
                stroke="#007aff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />{' '}
            </svg>{' '}
          </button>{' '}
          <div class="contact-info">
            {' '}
            <div class="avatar">J</div>{' '}
            <div class="contact-details">
              {' '}
              <span class="contact-name" value= {contact}></span>{' '}
            </div>{' '}
            <span class="detail-chevron">›</span>{' '}
          </div>{' '}
        </div>
        {displayed.map((msg) =>
          msg ? (
            <ChatBubble
              key={msg.id}
              sender={msg.sender}
              text={msg.text}
              isUser={msg.sender.toLowerCase() === 'p1'}
            />
          ) : null
        )}
      </div>
    </div>
  );
}
