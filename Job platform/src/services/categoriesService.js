import axios from 'axios';

const API_URL = '/api/companies/categories/';

// Кеш для хранения полученных категорий
let categoriesCache = null;
let categoryDetailsCache = {};

// Моковые данные для тестирования при недоступности API
const MOCK_CATEGORIES = [
  { id: 1, name: 'Frontend', vacancies_count: 12 },
  { id: 2, name: 'Backend', vacancies_count: 8 },
  { id: 3, name: 'DevOps', vacancies_count: 5 },
  { id: 4, name: 'UX/UI дизайн', vacancies_count: 3 },
  { id: 5, name: 'Тестирование', vacancies_count: 7 },
  { id: 6, name: 'Мобильная разработка', vacancies_count: 4 },
  { id: 7, name: 'Аналитика данных', vacancies_count: 6 },
  { id: 8, name: 'Проектный менеджмент', vacancies_count: 3 },
  { id: 9, name: 'Кибербезопасность', vacancies_count: 2 },
];

export const categoriesService = {
    // Получение всех категорий с кешированием
    getCategories: async () => {
        // Если у нас уже есть кешированные категории, возвращаем их
        if (categoriesCache) {
            return categoriesCache;
        }
        
        try {
            const response = await axios.get(API_URL);
            
            // Проверка формата ответа
            if (response.data && Array.isArray(response.data)) {
                categoriesCache = response.data;
                return response.data;
            } else if (response.data && Array.isArray(response.data.results)) {
                categoriesCache = response.data.results;
                return response.data.results;
            } else {
                console.warn('API категорий вернул неожиданный формат данных');
                categoriesCache = MOCK_CATEGORIES;
                return MOCK_CATEGORIES;
            }
        } catch (error) {
            console.error('Ошибка при получении категорий:', error);
            categoriesCache = MOCK_CATEGORIES;
            return MOCK_CATEGORIES;
        }
    },

    // Получение категории по ID с кешированием
    getCategoryById: async (id) => {
        // Если категория уже кеширована, возвращаем ее
        if (categoryDetailsCache[id]) {
            return categoryDetailsCache[id];
        }
        
        try {
            const response = await axios.get(`${API_URL}${id}/`);
            
            if (response.data) {
                categoryDetailsCache[id] = response.data;
                return response.data;
            }
        } catch (error) {
            console.error(`Ошибка при получении категории #${id}:`, error);
            
            if (categoriesCache) {
                const category = categoriesCache.find(cat => cat.id === parseInt(id));
                if (category) {
                    categoryDetailsCache[id] = category;
                    return category;
                }
            }
            
            const mockCategory = MOCK_CATEGORIES.find(cat => cat.id === parseInt(id));
            if (mockCategory) {
                categoryDetailsCache[id] = mockCategory;
                return mockCategory;
            }
        }
        
        return null;
    },

    getCategoryVacancies: async (id, params = {}) => {
        try {
            const response = await axios.get(`${API_URL}${id}/vacancies/`, { params });
            
            if (response.data && Array.isArray(response.data)) {
                return {
                    results: response.data,
                    count: response.data.length
                };
            } else if (response.data && Array.isArray(response.data.results)) {
                return {
                    results: response.data.results,
                    count: response.data.count || response.data.results.length
                };
            } else {
                return { results: [], count: 0 };
            }
        } catch (error) {
            console.error(`Ошибка при получении вакансий категории #${id}:`, error);
            return { results: [], count: 0 };
        }
    },
    
    clearCache: () => {
        categoriesCache = null;
        categoryDetailsCache = {};
    }
};