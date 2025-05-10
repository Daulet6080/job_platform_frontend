import axios from 'axios';

const API_URL = '/api/companies/companies/';

// Кеш для оптимизации запросов
const companiesCache = {
  list: null,
  details: {},
  timestamp: null,
  timeout: 5 * 60 * 1000 // 5 минут кеширования
};

export const companiesService = {
  // Получение списка компаний
  getCompanies: async (params = {}) => {
    try {
      // Если есть кеш и нет параметров фильтрации, возвращаем кешированный результат
      if (
        !Object.keys(params).length && 
        companiesCache.list && 
        Date.now() - companiesCache.timestamp < companiesCache.timeout
      ) {
        console.log('Используем кешированный список компаний');
        return companiesCache.list;
      }
      
      console.log('Запрашиваем список компаний с параметрами:', params);
      const response = await axios.get(API_URL, { params });
      
      // Кешируем результат, если нет параметров фильтрации
      if (!Object.keys(params).length) {
        companiesCache.list = response.data;
        companiesCache.timestamp = Date.now();
      }
      
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении списка компаний:', error);
      return [];
    }
  },

  // Получение детальной информации о компании
  getCompanyById: async (id) => {
    try {
      // Проверяем кеш
      if (companiesCache.details[id] && 
          Date.now() - companiesCache.details[id].timestamp < companiesCache.timeout) {
        console.log(`Используем кешированные данные для компании #${id}`);
        return companiesCache.details[id].data;
      }
      
      console.log(`Запрашиваем информацию о компании #${id}`);
      const response = await axios.get(`${API_URL}${id}/`);
      
      // Кешируем результат
      companiesCache.details[id] = {
        data: response.data,
        timestamp: Date.now()
      };
      
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении информации о компании #${id}:`, error);
      return null;
    }
  },

  // Получение вакансий компании
  getCompanyVacancies: async (companyId, params = {}) => {
    try {
      console.log(`Запрашиваем вакансии компании #${companyId}`);
      
      // Добавляем filter по компании
      const queryParams = { ...params, company: companyId, public: true };
      const response = await axios.get('/api/companies/vacancies/', { params: queryParams });
      
      return {
        results: response.data.results || response.data,
        count: response.data.count || (Array.isArray(response.data) ? response.data.length : 0)
      };
    } catch (error) {
      console.error(`Ошибка при получении вакансий компании #${companyId}:`, error);
      return { results: [], count: 0 };
    }
  },

  // Очистка кеша
  clearCache: () => {
    companiesCache.list = null;
    companiesCache.details = {};
    companiesCache.timestamp = null;
    console.log('Кеш компаний очищен');
  }
};