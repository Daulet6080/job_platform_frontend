import React, { useState } from 'react';
import '../styles/ChatWindow.css';

const ChatWindow = ({ 
  conversation, 
  messages, 
  currentUser, 
  onSendMessage,
  error,
  messagesEndRef
}) => {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Получаем собеседника для отображения имени в заголовке
  const otherParticipant = conversation?.participants_details?.find(
    user => user.id !== currentUser.id
  );
  
  // Отправка сообщения
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  // Функция для форматирования времени сообщения
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Группировка сообщений по дате
  const groupMessagesByDate = () => {
    if (!messages || messages.length === 0) return {};
    
    const groups = {};
    messages.forEach(message => {
      const timestamp = message.timestamp || message.created_at;
      if (!timestamp) return;
      
      const date = new Date(timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="chat-window">
      {/* Заголовок чата с информацией о собеседнике */}
      <div className="chat-header">
        {otherParticipant ? (
          <div className="chat-user-info">
            <div className="chat-user-avatar">
              {otherParticipant.profile_image ? (
                <img src={otherParticipant.profile_image} alt={`${otherParticipant.username} avatar`} />
              ) : (
                <div className="default-avatar">
                  {otherParticipant.first_name?.[0] || otherParticipant.username?.[0] || '?'}
                </div>
              )}
            </div>
            <div className="chat-user-details">
              <h3>
                {otherParticipant.first_name 
                  ? `${otherParticipant.first_name} ${otherParticipant.last_name || ''}`
                  : otherParticipant.username}
              </h3>
              <span className="user-status">
                {otherParticipant.is_online ? 'В сети' : 'Не в сети'}
              </span>
            </div>
          </div>
        ) : (
          <h3>Загрузка беседы...</h3>
        )}
      </div>

      {/* Область с сообщениями */}
      <div className="chat-messages-container">
        {error ? (
          <div className="chat-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Обновить</button>
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="no-messages">
            <p>Нет сообщений. Начните общение прямо сейчас!</p>
          </div>
        ) : (
          <div className="chat-messages">
            {Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date} className="message-group">
                <div className="date-separator">
                  <span>{new Date(date).toLocaleDateString('ru-RU', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                {msgs.map(message => {
                  const isMine = message.sender === currentUser.id || 
                               message.sender_id === currentUser.id;
                  
                  return (
                    <div 
                      key={message.id} 
                      className={`message ${isMine ? 'message-mine' : 'message-other'}`}
                    >
                      {!isMine && (
                        <div className="message-avatar">
                          {otherParticipant?.profile_image ? (
                            <img src={otherParticipant.profile_image} alt="avatar" />
                          ) : (
                            <div className="default-avatar">
                              {otherParticipant?.first_name?.[0] || otherParticipant?.username?.[0] || '?'}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="message-content">
                        <div className="message-bubble">
                          <p>{message.content || message.text}</p>
                          {message.attachment && (
                            <div className="message-attachment">
                              <a href={message.attachment} target="_blank" rel="noopener noreferrer">
                                Прикреплённый файл
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="message-meta">
                          <span className="message-time">
                            {formatMessageTime(message.timestamp || message.created_at)}
                          </span>
                          {isMine && (
                            <span className="message-status">
                              {message.is_read ? "✓✓" : "✓"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Форма отправки сообщений */}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="chat-input-container">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Введите сообщение..."
            className="chat-input"
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!messageText.trim()}
          >
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;