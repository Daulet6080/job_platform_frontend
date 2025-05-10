/**
 * Получение токена из localStorage
 */
export const getToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Сохранение токена в localStorage
 */
export const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

/**
 * Удаление токена из localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Проверка наличия токена
 */
export const hasToken = () => {
  return !!localStorage.getItem('authToken');
};

/**
 * Создание заголовка авторизации для запросов
 */
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Token ${token}` } : {};
};

/**
 * Настройка интерцептора для axios для автоматического добавления токена
 */
export const setupAxiosInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers['Authorization'] = `Token ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  return axiosInstance;
};