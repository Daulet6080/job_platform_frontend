import axios from 'axios';
import axiosAPI from '../utils/axiosInterceptor';

const API_URL = 'http://localhost:8000/api/';

export const authService = {
    login: async (username, password) => {
        try {
            const response = await axios.post(API_URL + 'token/', {
                username,
                password
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Ошибка сервера');
        }
    },

    registerJobSeeker: async (userData) => {
        try {
            const response = await axios.post(API_URL + 'users/register/jobseeker/', userData);
            return response.data;
        } catch (error) {
            console.error('Ошибка при регистрации соискателя:', error.response ? error.response.data : error.message);
            throw error.response ? error.response.data : new Error('Ошибка сервера');
        }
    },

    registerEmployer: async (userData) => {
        try {
            // Добавляем отладочный вывод данных
            console.log('Регистрация работодателя, отправляемые данные:', userData);
            
            // Преобразуем данные в формат, ожидаемый сервером
            const formattedData = {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                password2: userData.password2 || userData.confirm_password,
                first_name: userData.first_name,
                last_name: userData.last_name,
                role: 'employer',
                position: userData.position || 'Менеджер', // Добавляем должность по умолчанию
                company_name: userData.company_name || 'Моя компания' // Добавляем имя компании
            };

            const response = await axios.post(API_URL + 'users/register/employer/', formattedData);
            return response.data;
        } catch (error) {
            console.error('Ошибка при регистрации работодателя:', 
                error.response ? error.response.data : error.message);
            throw error.response ? error.response.data : new Error('Ошибка сервера');
        }
    },

    // Остальные методы без изменений
    refreshToken: async (refreshToken) => {
        try {
            const response = await axios.post(API_URL + 'token/refresh/', {
                refresh: refreshToken
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Ошибка обновления токена');
        }
    },

    getJobSeekerProfile: async () => {
        try {
            const response = await axiosAPI.get('users/jobseeker/profile/');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Ошибка получения профиля');
        }
    },

    getEmployerProfile: async () => {
        try {
            const response = await axiosAPI.get('users/employers/profile/');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Ошибка получения профиля');
        }
    },

    updateJobSeekerProfile: async (profileData) => {
        try {
            const response = await axiosAPI.patch('users/jobseeker/profile/', profileData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Ошибка обновления профиля');
        }
    },

    updateEmployerProfile: async (profileData) => {
        try {
            const response = await axiosAPI.patch('users/employers/profile/', profileData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Ошибка обновления профиля');
        }
    },

    changePassword: async (passwordData) => {
        try {
            const response = await axiosAPI.post('users/change_password/', passwordData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Ошибка смены пароля');
        }
    },

    getUserResume: async () => {
        try {
            const response = await axiosAPI.get('resumes/my/');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Ошибка получения резюме');
        }
    },

    getCompanyVacancies: async (companyId) => {
        try {
            const response = await axiosAPI.get(`vacancies/?company=${companyId}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Ошибка получения вакансий');
        }
    },

    getCompanyDetails: async (companyId) => {
        try {
            const response = await axiosAPI.get(`companies/company/${companyId}/`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Ошибка получения данных компании');
        }
    }
};