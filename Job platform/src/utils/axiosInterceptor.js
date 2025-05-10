import axios from 'axios';

// Создаем экземпляр axios с базовым URL
const axiosAPI = axios.create({
  baseURL: 'http://localhost:8000',
});

// Добавляем перехватчик запросов для добавления токена авторизации
axiosAPI.interceptors.request.use(
  (config) => {
    // Получаем пользователя из того же места, что и AuthContext
    const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
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
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Получаем пользователя из storage
        const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
        
        if (user && user.refreshToken) {
          const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: user.refreshToken
          });
          
          // Сохраняем обновленного пользователя
          const updatedUser = {
            ...user,
            token: response.data.access,
            refreshToken: response.data.refresh || user.refreshToken
          };
          
          // Сохраняем в то же хранилище, где был пользователь
          if (localStorage.getItem('user')) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } else {
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
          }
          
          // Повторяем исходный запрос с новым токеном
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return axiosAPI(originalRequest);
        }
      } catch (refreshError) {
        // Если не удалось обновить токен, выходим из системы
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosAPI;