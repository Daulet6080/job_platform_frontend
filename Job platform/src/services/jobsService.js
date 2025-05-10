import axios from '../utils/axiosInterceptor';

const API_URL = '/api/companies/vacancies/';

// Кеш для оптимизации запросов
const jobsCache = {
  data: new Map(),
  timeout: 15000, // 15 секунд кеширования
};

// Создание ключа кеша на основе параметров запроса
const createCacheKey = (params) => {
  return JSON.stringify(params || {});
};

export const jobsService = {
    getJobs: async (filters = {}) => {
        try {
            // Создаем ключ кеша для текущего запроса
            const cacheKey = createCacheKey(filters);
            
            // Проверяем наличие данных в кеше
            const cachedData = jobsCache.data.get(cacheKey);
            if (cachedData && Date.now() - cachedData.timestamp < jobsCache.timeout) {
                console.log('Используем кешированные данные для вакансий', filters);
                return cachedData.data;
            }
            
            // Формируем параметры запроса
            const queryParams = new URLSearchParams();
            queryParams.append('public', 'true');
            
            // Корректная обработка параметра category
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== '' && value !== null) {
                    // Преобразование числовых значений к строке
                    const stringValue = String(value);
                    console.log(`Добавляем параметр ${key}=${stringValue}`);
                    queryParams.append(key, stringValue);
                }
            });
            
            const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
            console.log(`Запрашиваем API: ${API_URL}${query}`);
            
            const response = await axios.get(`${API_URL}${query}`);
            
            // Проверяем и обрабатываем данные ответа
            const responseData = {
                results: response.data.results || response.data,
                count: response.data.count || (Array.isArray(response.data) ? response.data.length : 0)
            };
            
            console.log(`Получены данные: ${responseData.count} вакансий`);
            
            // Кешируем полученные данные
            jobsCache.data.set(cacheKey, {
                data: responseData,
                timestamp: Date.now()
            });
            
            return responseData;
        } catch (error) {
            console.error('Ошибка при получении вакансий:', error);
            return { results: [], count: 0 };
        }
    },

    getJobById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}${id}/?public=true`);
            return response.data;
        } catch (error) {
            console.error(`Ошибка при получении вакансии #${id}:`, error);
            return null;
        }
    },

    createJob: async (jobData) => {
        try {
            const response = await axios.post(API_URL, jobData);
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании вакансии:', error);
            throw error.response ? error.response.data : new Error('Ошибка сервера при создании вакансии');
        }
    },

    updateJob: async (id, jobData) => {
        try {
            const response = await axios.put(`${API_URL}${id}/`, jobData);
            return response.data;
        } catch (error) {
            console.error(`Ошибка при обновлении вакансии #${id}:`, error);
            throw error.response ? error.response.data : new Error('Ошибка сервера при обновлении вакансии');
        }
    },

    // Метод для очистки кеша
    clearCache: () => {
        jobsCache.data.clear();
        console.log('Кеш вакансий очищен');
    }
};