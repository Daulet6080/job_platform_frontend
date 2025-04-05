import axios from 'axios';

const API_URL = 'http://localhost:8081';

export const registerUser = async (username, fullname, email, password) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await axios.post(`${API_URL}/user`, {
            username,
            fullname,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (username, password) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await axios.post(`${API_URL}/auth/auth_token`, {
            username,
            password,
        });
        return response.data; // Или response, в зависимости от структуры ответа API
    } catch (error) {
        throw error;
    }
};