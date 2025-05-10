import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';
import { AuthContext } from '../context/AuthContext';
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
  const [websocket, setWebsocket] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Загружаем список бесед
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await chatService.getConversations();
        setConversations(data);
        setLoading(false);
      } catch (err) {
        setError('Не удалось загрузить список бесед');
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Следим за изменением идентификатора беседы в URL
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === parseInt(conversationId));
      if (conversation) {
        setActiveConversation(conversation);
      } else {
        // Если беседа не найдена, перенаправляем на страницу чатов
        navigate('/chat', { replace: true });
      }
    } else if (conversations.length > 0 && !conversationId) {
      // Если беседы есть, но нет активной, выбираем первую
      navigate(`/chat/${conversations[0].id}`);
    }
  }, [conversationId, conversations, navigate]);

  // Загружаем сообщения при смене активной беседы
  useEffect(() => {
    if (activeConversation) {
      const fetchMessages = async () => {
        try {
          const data = await chatService.getMessages(activeConversation.id);
          setMessages(data);
          
          // Отмечаем сообщения как прочитанные
          await chatService.markConversationAsRead(activeConversation.id);
          
          // Обновляем список бесед для обновления счетчиков непрочитанных
          const updatedConversations = await chatService.getConversations();
          setConversations(updatedConversations);
          
        } catch (err) {
          setError('Не удалось загрузить сообщения');
        }
      };

      fetchMessages();
      initWebSocketConnection(activeConversation.id);
      
      // При размонтировании закрываем WebSocket
      return () => {
        if (websocket) {
          websocket.close();
        }
      };
    }
  }, [activeConversation]);

  // Прокручиваем к последнему сообщению при получении новых сообщений
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Инициализация соединения WebSocket
  const initWebSocketConnection = (conversationId) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws/chat/${conversationId}/`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket соединение установлено');
      setWebsocket(ws);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'message') {
        // Добавляем новое сообщение в список
        setMessages(prev => [...prev, data.message]);
        
        // Если сообщение от другого пользователя, отправляем статус прочтения
        if (data.message.sender_id !== currentUser.id) {
          ws.send(JSON.stringify({
            type: 'read',
            conversation_id: conversationId
          }));
          
          // Обновляем список бесед для обновления счетчиков непрочитанных
          chatService.getConversations().then(setConversations);
        }
      } else if (data.type === 'read_receipt') {
        // Обновляем статус прочтения сообщений
        setMessages(prev => prev.map(msg => {
          if (!msg.is_read) {
            return { ...msg, is_read: true };
          }
          return msg;
        }));
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket соединение закрыто');
      // Пытаемся переподключиться через 3 секунды
      setTimeout(() => {
        if (activeConversation && activeConversation.id === conversationId) {
          initWebSocketConnection(conversationId);
        }
      }, 3000);
    };
    
    return ws;
  };

  // Отправка сообщения
  const handleSendMessage = (content) => {
    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
      setError('Нет соединения с сервером. Попробуйте обновить страницу.');
      return;
    }
    
    // Отправляем сообщение через WebSocket
    websocket.send(JSON.stringify({
      type: 'message',
      message: content
    }));
  };

  // Создание новой беседы с пользователем
  const startNewConversation = async (userId) => {
    try {
      const conversation = await chatService.createOrGetDirect(userId);
      setConversations(prev => {
        if (!prev.find(c => c.id === conversation.id)) {
          return [conversation, ...prev];
        }
        return prev;
      });
      navigate(`/chat/${conversation.id}`);
    } catch (err) {
      setError('Не удалось создать беседу');
    }
  };

  return (
    <div className="chat-page">
      <Header />
      <NavigationBar />
      
      <div className="chat-container">
        <div className="chat-sidebar">
          <h2 className="sidebar-title">Сообщения</h2>
          {loading ? (
            <div className="loading-indicator">Загрузка бесед...</div>
          ) : (
            <ConversationList 
              conversations={conversations}
              activeConversation={activeConversation}
              currentUser={currentUser}
              onSelectConversation={(id) => navigate(`/chat/${id}`)}
              onStartNewConversation={startNewConversation}
            />
          )}
        </div>
        
        <div className="chat-main">
          {activeConversation ? (
            <ChatWindow 
              conversation={activeConversation}
              messages={messages}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              error={error}
              messagesEndRef={messagesEndRef}
            />
          ) : (
            <div className="no-conversation-selected">
              <p>Выберите беседу или начните новую</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ChatPage;