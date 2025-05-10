import axiosAPI from '../utils/axiosInterceptor';

const API_URL = '/api/companies/vacancies/';

export const jobsService = {
    getJobs: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('public', 'true');
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== '' && value !== null) {
                    queryParams.append(key, value);
                }
            });
            
            const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
            console.log(`Запрашиваем API: ${API_URL}${query}`);
            
            const response = await axiosAPI.get(`${API_URL}${query}`);
            console.log('Получен ответ:', response.data);
            
            return {
                results: response.data.results || response.data,
                count: response.data.count || (Array.isArray(response.data) ? response.data.length : 0)
            };
        } catch (error) {
            console.error('Ошибка при получении вакансий:', error);
            return { results: [], count: 0 };
        }
    },

    getJobById: async (id) => {
        try {
            const response = await axiosAPI.get(`${API_URL}${id}/?public=true`);
            return response.data;
        } catch (error) {
            console.error(`Ошибка при получении вакансии #${id}:`, error);
            return null;
        }
    },

    createJob: async (jobData) => {
        try {
            const response = await axiosAPI.post(API_URL, jobData);
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании вакансии:', error);
            throw error.response ? error.response.data : new Error('Ошибка сервера при создании вакансии');
        }
    },

    updateJob: async (id, jobData) => {
        try {
            const response = await axiosAPI.put(`${API_URL}${id}/`, jobData);
            return response.data;
        } catch (error) {
            console.error(`Ошибка при обновлении вакансии #${id}:`, error);
            throw error.response ? error.response.data : new Error('Ошибка сервера при обновлении вакансии');
        }
    }
};