import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import '../../styles/ConversationList.css';

const ConversationList = ({ 
  conversations, 
  activeConversation, 
  currentUser,
  onSelectConversation,
  onStartNewConversation
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Функция для получения данных о собеседнике
  const getOtherParticipant = (conversation) => {
    return conversation.participants_details.find(
      user => user.id !== currentUser.id
    );
  };

  // Фильтруем беседы по поисковому запросу
  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = getOtherParticipant(conversation);
    if (!otherParticipant) return false;
    
    const fullName = `${otherParticipant.first_name} ${otherParticipant.last_name}`.toLowerCase();
    const username = otherParticipant.username.toLowerCase();
    
    return fullName.includes(searchTerm.toLowerCase()) || 
           username.includes(searchTerm.toLowerCase());
  });

  // Форматирование времени последнего сообщения
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ru
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="conversation-list">
      <div className="conversation-search">
        <input 
          type="text"
          placeholder="Поиск бесед..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="conversation-search-input"
        />
      </div>
      
      {filteredConversations.length === 0 ? (
        <div className="no-conversations">
          <p>Бесед не найдено</p>
          <button className="start-new-chat-btn" onClick={() => onStartNewConversation()}>
            Начать новую беседу
          </button>
        </div>
      ) : (
        <ul className="conversations-items">
          {filteredConversations.map(conversation => {
            const otherParticipant = getOtherParticipant(conversation);
            const lastMessage = conversation.last_message;
            const isActive = activeConversation && activeConversation.id === conversation.id;
            const hasUnread = conversation.unread_count > 0;
            
            return (
              <li 
                key={conversation.id} 
                className={`conversation-item ${isActive ? 'active' : ''} ${hasUnread ? 'unread' : ''}`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="conversation-avatar">
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
                  
                  {otherParticipant?.is_online && (
                    <span className="online-indicator"></span>
                  )}
                </div>
                
                <div className="conversation-info">
                  <div className="conversation-header">
                    <h3 className="participant-name">
                      {otherParticipant?.first_name 
                        ? `${otherParticipant.first_name} ${otherParticipant.last_name}`
                        : otherParticipant?.username || 'Пользователь'
                      }
                    </h3>
                    <span className="conversation-time">
                      {lastMessage ? formatTimestamp(lastMessage.timestamp) : ''}
                    </span>
                  </div>
                  
                  <div className="conversation-preview">
                    <p className="message-preview">
                      {lastMessage ? (
                        lastMessage.sender === currentUser.id ? (
                          <span className="own-message">Вы: </span>
                        ) : null
                      ) : null}
                      {lastMessage?.content || 'Нет сообщений'}
                    </p>
                    
                    {hasUnread && (
                      <span className="unread-badge">{conversation.unread_count}</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      
      <button className="new-conversation-btn" onClick={() => onStartNewConversation()}>
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        Новая беседа
      </button>
    </div>
  );
};

export default ConversationList;