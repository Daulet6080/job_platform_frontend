import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import UserSelector from '../components/UserSelector';
import { chatService } from '../services/chatService';
import '../styles/ChatPage.css';

const ChatPage = () => {
  const { conversationId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserSelector, setShowUserSelector] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Получение списка бесед
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        console.log('Загрузка бесед...');
        const data = await chatService.getConversations();
        console.log('Получены беседы:', data);
        setConversations(data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке бесед:', err);
        setError('Не удалось загрузить список бесед');
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, []);

  // Установка активной беседы при изменении URL или списка бесед
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === parseInt(conversationId));
      if (conversation) {
        setActiveConversation(conversation);
      } else {
        setError('Беседа не найдена');
        navigate('/chat');
      }
    } else if (!conversationId && conversations.length > 0) {
      // Если нет conversationId в URL, но есть беседы, активируем первую
      setActiveConversation(conversations[0]);
      navigate(`/chat/${conversations[0].id}`);
    }
  }, [conversationId, conversations, navigate]);

  // Получение сообщений активной беседы
  useEffect(() => {
    if (activeConversation) {
      const fetchMessages = async () => {
        try {
          setLoading(true);
          console.log(`Загрузка сообщений для беседы ${activeConversation.id}...`);
          const data = await chatService.getMessages(activeConversation.id);
          console.log('Получены сообщения:', data);
          setMessages(data);
          setLoading(false);
          
          // Прокрутка к последнему сообщению
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
          
          // Отметить сообщения как прочитанные
          chatService.markConversationAsRead(activeConversation.id)
            .catch(err => console.error('Ошибка при отметке сообщений как прочитанных:', err));
            
        } catch (err) {
          console.error('Ошибка при загрузке сообщений:', err);
          setError('Не удалось загрузить сообщения');
          setLoading(false);
        }
      };
      
      fetchMessages();
    }
  }, [activeConversation]);

  // Прокрутка вниз при добавлении новых сообщений
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Обработчик выбора беседы
  const handleSelectConversation = (conversation) => {
    navigate(`/chat/${conversation.id}`);
  };

  // Обработчик начала новой беседы
  const handleStartNewConversation = () => {
    setShowUserSelector(true);
  };

  // Обработчик выбора пользователя для новой беседы
  const handleSelectUser = async (user) => {
    try {
      setShowUserSelector(false);
      setLoading(true);
      
      // Создаем или получаем существующую беседу с выбранным пользователем
      const response = await chatService.createOrGetDirect(user.id);
      
      // Добавляем новую беседу в список, если её там ещё нет
      if (response && response.id) {
        const existingConversation = conversations.find(c => c.id === response.id);
        if (!existingConversation) {
          setConversations(prevConversations => [response, ...prevConversations]);
        }
        
        // Переходим к новой беседе
        navigate(`/chat/${response.id}`);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при создании беседы:', err);
      setError('Не удалось создать беседу');
      setLoading(false);
      setShowUserSelector(false);
    }
  };

  // Обработчик отправки сообщения
  const handleSendMessage = async (content) => {
    if (!activeConversation) return;
    
    try {
      const newMessage = await chatService.sendMessage(activeConversation.id, content);
      
      // Добавляем новое сообщение в список
      setMessages(prev => [...prev, newMessage]);
      
      // Обновляем последнее сообщение в списке бесед
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === activeConversation.id 
            ? { 
                ...conv, 
                last_message: newMessage,
                updated_at: new Date().toISOString()
              } 
            : conv
        ).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      );
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err);
      setError('Не удалось отправить сообщение');
    }
  };

  // Закрытие селектора пользователей
  const handleCancelUserSelection = () => {
    setShowUserSelector(false);
  };

  return (
    <div className="chat-page">
      <div className="container">
        <h1 className="page-title">Сообщения</h1>
        
        <div className="chat-container">
          {showUserSelector ? (
            <UserSelector
              onSelect={handleSelectUser}
              onCancel={handleCancelUserSelection}
              currentUserId={currentUser.id}
            />
          ) : (
            <>
              {/* Левая колонка с списком бесед */}
              <div className="chat-sidebar">
                <ConversationList
                  conversations={conversations}
                  activeConversation={activeConversation}
                  currentUser={currentUser}
                  onSelectConversation={handleSelectConversation}
                  onStartNewConversation={handleStartNewConversation}
                />
              </div>
              
              {/* Правая колонка с чатом */}
              <div className="chat-main">
                {loading && !activeConversation ? (
                  <div className="loading-indicator">
                    <div className="spinner"></div>
                    <p>Загрузка...</p>
                  </div>
                ) : !activeConversation ? (
                  <div className="no-conversation-selected">
                    <p>Выберите беседу или начните новую</p>
                  </div>
                ) : (
                  <ChatWindow
                    conversation={activeConversation}
                    messages={messages}
                    currentUser={currentUser}
                    onSendMessage={handleSendMessage}
                    error={error}
                    messagesEndRef={messagesEndRef}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;