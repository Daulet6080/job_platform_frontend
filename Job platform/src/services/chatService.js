import axios from 'axios';

// Base URL для API чата - используйте относительный путь
const API_URL = '/api/chat';

// Создаем инстанс axios с правильными заголовками
const chatApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Интерцептор для добавления токена авторизации
chatApi.interceptors.request.use(
  (config) => {
    // Получаем токен из хранилища
    const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    
    if (user && user.token) {
      // ВАЖНО: Используем правильный формат токена (Bearer или Token в зависимости от настроек бэкенда)
      config.headers['Authorization'] = `Bearer ${user.token}`;
      
      // Отладочная информация
      console.log(`Отправка запроса: ${config.method.toUpperCase()} ${config.url}`);
      console.log('Заголовки:', JSON.stringify(config.headers));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const chatService = {
  // Получение списка бесед
  getConversations: async () => {
    try {
      console.log('Запрашиваю список бесед...');
      const response = await chatApi.get('/conversations/');
      console.log('Получен список бесед:', response.data);
      return response.data.results || response.data;
    } catch (error) {
      console.error('Ошибка при получении списка бесед:', error);
      throw error;
    }
  },
  
  // Получение сообщений из беседы
  getMessages: async (conversationId) => {
    try {
      console.log(`Запрашиваю сообщения беседы ${conversationId}...`);
      const response = await chatApi.get(`/conversations/${conversationId}/messages/`);
      console.log('Получены сообщения:', response.data);
      return response.data.results || response.data;
    } catch (error) {
      console.error('Ошибка при получении сообщений:', error);
      throw error;
    }
  },
  
  // Отправка сообщения
  sendMessage: async (conversationId, content) => {
    try {
      console.log(`Отправка сообщения в беседу ${conversationId}:`, content);
      const response = await chatApi.post(
        `/conversations/${conversationId}/messages/`,
        { content }
      );
      console.log('Ответ от сервера:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      throw error;
    }
  },
  

  
  // Создание или получение прямой беседы с пользователем
  createOrGetDirect: async (userId) => {
    try {
      console.log(`Создание/получение беседы с пользователем ${userId}...`);
      const response = await chatApi.post(
        '/conversations/create_or_get_direct/',
        { user_id: userId }
      );
      console.log('Ответ от сервера:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании беседы:', error);
      throw error;
    }
  }
};