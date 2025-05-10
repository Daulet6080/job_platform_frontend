import axios from 'axios';

// Base URL для API чата
const API_URL = '/api/chat';

export const chatService = {
  // Получение списка бесед
  getConversations: async () => {
    try {
      const response = await axios.get(`${API_URL}/conversations/`);
      return response.data.results || response.data;
    } catch (error) {
      console.error('Ошибка при получении списка бесед:', error);
      throw error;
    }
  },
  
  // Получение сообщений из беседы
  getMessages: async (conversationId, params = {}) => {
    try {
      const response = await axios.get(
        `${API_URL}/conversations/${conversationId}/messages/`,
        { params }
      );
      return response.data.results || response.data;
    } catch (error) {
      console.error('Ошибка при получении сообщений:', error);
      throw error;
    }
  },
  
  // Отправка сообщения
  sendMessage: async (conversationId, content) => {
    try {
      const response = await axios.post(
        `${API_URL}/conversations/${conversationId}/send_message/`,
        { content }
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      throw error;
    }
  },
  
  // Отметка сообщений как прочитанных
  markConversationAsRead: async (conversationId) => {
    try {
      const response = await axios.post(
        `${API_URL}/conversations/${conversationId}/mark_as_read/`
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при отметке сообщений как прочитанных:', error);
      throw error;
    }
  },
  
  // Получение списка уведомлений
  getNotifications: async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications/`);
      return response.data.results || response.data;
    } catch (error) {
      console.error('Ошибка при получении уведомлений:', error);
      throw error;
    }
  },
  
  // Отметка всех уведомлений как прочитанных
  markAllNotificationsAsRead: async () => {
    try {
      const response = await axios.post(`${API_URL}/notifications/mark_all_read/`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при отметке всех уведомлений как прочитанных:', error);
      throw error;
    }
  },
  
  // Создание или получение прямой беседы с пользователем
  createOrGetDirect: async (userId) => {
    try {
      const response = await axios.get(
        `${API_URL}/conversations/create_or_get_direct/`,
        { params: { user_id: userId } }
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании беседы:', error);
      throw error;
    }
  }
};