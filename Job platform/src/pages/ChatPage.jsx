import React, { useState } from 'react';
import '../styles/ChatPage.css';
import { SendOutlined } from '@ant-design/icons';

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: 'user' }]);
            setInput('');
        }
    };

    return (
        <div className="chat-page">
            <h2>Чат</h2>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <span>&lt;{msg.text}&gt;</span>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Введите сообщение..."
                />
                <button onClick={sendMessage}>
                    <SendOutlined />
                </button>
            </div>
        </div>
    );
}