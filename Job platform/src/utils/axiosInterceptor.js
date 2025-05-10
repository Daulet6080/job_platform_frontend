import axios from 'axios';

// Создаем экземпляр axios с базовым URL
const axiosAPI = axios.create({
  baseURL: 'http://localhost:8000',
});

// Добавляем перехватчик запросов для добавления токена авторизации
axiosAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Добавляем перехватчик ответов для обработки ошибок авторизации
axiosAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Если ошибка 401 (Unauthorized) и запрос не был повторен
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Пытаемся обновить токен
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken
          });
          
          // Сохраняем новый токен
          localStorage.setItem('accessToken', response.data.access);
          
          // Повторяем исходный запрос с новым токеном
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return axiosAPI(originalRequest);
        }
      } catch (refreshError) {
        // Если не удалось обновить токен, выходим из системы
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosAPI;