import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import '../../styles/ChatWindow.css';

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

  // Группируем сообщения по дате для отображения разделителей
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString();
      
      if (!groups[date]) {
        groups[date] = [];
      }
      
      groups[date].push(message);
    });
    
    return groups;
  };
  
  // Объединенные сообщения по дате
  const messageGroups = groupMessagesByDate(messages);
  
  // Форматирование времени сообщения
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Форматирование даты для разделителя
  const formatDateSeparator = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      });
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-participant">
          <div className="participant-avatar">
            {otherParticipant?.profile_picture ? (
              <img 
                src={otherParticipant.profile_picture} 
                alt={`${otherParticipant.first_name} ${otherParticipant.last_name}`} 
              />
            ) : (
              <div className="avatar-placeholder">
                {otherParticipant?.first_name?.[0] || otherParticipant?.username?.[0] || '?'}
              </div>
            )}
          </div>
          
          <div className="participant-info">
            <h3 className="participant-name">
              {otherParticipant?.first_name 
                ? `${otherParticipant.first_name} ${otherParticipant.last_name}`
                : otherParticipant?.username || 'Пользователь'
              }
            </h3>
            {isTyping ? (
              <span className="typing-indicator">печатает...</span>
            ) : otherParticipant?.is_online ? (
              <span className="online-status">В сети</span>
            ) : otherParticipant?.last_seen ? (
              <span className="last-seen">
                {`Был${otherParticipant.gender === 'female' ? 'а' : ''} в сети ${
                  formatDistanceToNow(new Date(otherParticipant.last_seen), {
                    addSuffix: true,
                    locale: ru
                  })
                }`}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      
      <div className="chat-messages">
        {Object.keys(messageGroups).map(date => (
          <div key={date} className="message-group">
            <div className="date-separator">
              <span>{formatDateSeparator(date)}</span>
            </div>
            
            {messageGroups[date].map(message => {
              const isMine = message.sender_id === currentUser.id;
              
              return (
                <div 
                  key={message.id} 
                  className={`message ${isMine ? 'own-message' : 'other-message'}`}
                >
                  <div className="message-content">
                    <div className="message-text">{message.content}</div>
                    <div className="message-meta">
                      <span className="message-time">
                        {formatMessageTime(message.timestamp)}
                      </span>
                      
                      {isMine && (
                        <span className={`read-status ${message.is_read ? 'read' : ''}`}>
                          {message.is_read ? (
                            <svg viewBox="0 0 24 24" width="16" height="16">
                              <path fill="currentColor" d="M18 7l-1.41-1.41-6.59 6.58-2.59-2.58-1.41 1.41 4 4z"/>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" width="16" height="16">
                              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        
        {/* Для прокрутки к последнему сообщению */}
        <div ref={messagesEndRef} />
      </div>
      
      {error && (
        <div className="chat-error-message">
          {error}
        </div>
      )}
      
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Введите сообщение..."
          className="message-input"
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!messageText.trim()}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;