import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const axiosAPI = axios.create({
    baseURL: API_URL,
});

export const setupAxiosInterceptors = () => {
    axiosAPI.interceptors.request.use(
        (config) => {
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
    
    axiosAPI.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                
                try {
                    const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
                    
                    if (user && user.refreshToken) {
                        const response = await axios.post(`${API_URL}token/refresh/`, {
                            refresh: user.refreshToken
                        });
                        
                        if (response.data.access) {
                            const updatedUser = {
                                ...user,
                                token: response.data.access,
                                refreshToken: response.data.refresh || user.refreshToken
                            };
                            if (localStorage.getItem('user')) {
                                localStorage.setItem('user', JSON.stringify(updatedUser));
                            } else {
                                sessionStorage.setItem('user', JSON.stringify(updatedUser));
                            }
                            originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                            return axiosAPI(originalRequest);
                        }
                    }
                } catch (refreshError) {
                    localStorage.removeItem('user');
                    sessionStorage.removeItem('user');
                    
                    window.location.href = '/login';
                }
            }
            
            return Promise.reject(error);
        }
    );
};

export default axiosAPI;