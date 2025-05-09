import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
        if (user && user.token) {
            try {
                const decodedToken = jwtDecode(user.token);
                const currentTime = Date.now() / 1000;
                
                if (decodedToken.exp > currentTime) {
                    setCurrentUser(user);
                    if (user.role) {
                        fetchUserProfile(user.role);
                    }
                } else {
                    refreshUserToken(user.refreshToken);
                }
            } catch (error) {
                console.error('Ошибка декодирования токена:', error);
                logoutUser();
            }
        }
        setLoading(false);
    }, []);

    const fetchUserProfile = async (role) => {
        try {
            let profileData;
            if (role === 'jobseeker') {
                profileData = await authService.getJobSeekerProfile();
            } else if (role === 'employer') {
                profileData = await authService.getEmployerProfile();
            }
            
            if (profileData) {
                setUserProfile(profileData);
            }
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
            setError('Не удалось загрузить профиль');
        }
    };

    const refreshUserToken = async (refreshToken) => {
        try {
            const data = await authService.refreshToken(refreshToken);
            const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
            
            const updatedUser = {
                ...user,
                token: data.access,
                refreshToken: data.refresh || user.refreshToken
            };

            if (localStorage.getItem('user')) {
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } else {
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
            }

            setCurrentUser(updatedUser);
            
            if (updatedUser.role) {
                fetchUserProfile(updatedUser.role);
            }
        } catch (error) {
            console.error('Ошибка обновления токена:', error);
            logoutUser();
        }
    };

    const loginUser = async (username, password, rememberMe = false) => {
        try {
            setError(null);
            const data = await authService.login(username, password);
            
            const decodedToken = jwtDecode(data.access);
            
            const role = decodedToken.role || decodedToken.user_role || 'unknown';
            
            const user = {
                username: username,
                token: data.access,
                refreshToken: data.refresh,
                role: role
            };

            console.log("Пользователь авторизован с ролью:", role);

            if (rememberMe) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                sessionStorage.setItem('user', JSON.stringify(user));
            }

            setCurrentUser(user);
            
            if (user.role) {
                await fetchUserProfile(user.role);
            }
            
            return user;
        } catch (error) {
            setError(error.detail || 'Ошибка авторизации');
            throw error;
        }
    };
    const registerUser = async (userData, userType) => {
        try {
            setError(null);
            let data;
            
            if (userType === 'jobseeker') {
                data = await authService.registerJobSeeker(userData);
            } else if (userType === 'employer') {
                if (!userData.position) {
                    userData.position = 'Менеджер'; 
                }
                if (!userData.company_name) {
                    userData.company_name = userData.username + ' Company'; 
                }
                
                data = await authService.registerEmployer(userData);
            } else {
                throw new Error('Неизвестный тип пользователя');
            }
            
            if (data.token) {
                let role = userType;
                
                try {
                    const decodedToken = jwtDecode(data.token);
                    if (decodedToken.role || decodedToken.user_role) {
                        role = decodedToken.role || decodedToken.user_role;
                    }
                } catch (decodeError) {
                    console.warn('Ошибка декодирования токена:', decodeError);
                }
                
                const user = {
                    username: userData.username,
                    token: data.token,
                    refreshToken: data.refresh_token || '',
                    role: role
                };

                localStorage.setItem('user', JSON.stringify(user));
                setCurrentUser(user);
                
                setTimeout(async () => {
                    try {
                        await fetchUserProfile(role);
                    } catch (profileError) {
                        console.warn('Не удалось загрузить профиль после регистрации:', profileError);
                    }
                }, 1000);
            }
            
            return data;
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            
            let errorMessage = 'Ошибка регистрации';
            
            if (error.detail) {
                errorMessage = error.detail;
            } else if (error.message) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            } else if (error.non_field_errors) {
                errorMessage = error.non_field_errors.join(', ');
            } else {
                const fieldErrors = {};
                Object.keys(error).forEach(key => {
                    if (Array.isArray(error[key])) {
                        fieldErrors[key] = error[key].join(', ');
                    }
                });
                
                if (Object.keys(fieldErrors).length > 0) {
                    errorMessage = 'Ошибки валидации: ' + 
                        Object.entries(fieldErrors)
                            .map(([field, msg]) => `${field}: ${msg}`)
                            .join('; ');
                }
            }
            
            setError(errorMessage);
            throw errorMessage;
        }
    };

    const updateProfile = async (profileData) => {
        try {
            setError(null);
            if (!currentUser || !currentUser.role) {
                throw new Error('Пользователь не авторизован');
            }

            let updatedProfile;
            if (currentUser.role === 'jobseeker') {
                updatedProfile = await authService.updateJobSeekerProfile(profileData);
            } else if (currentUser.role === 'employer') {
                updatedProfile = await authService.updateEmployerProfile(profileData);
            }

            if (updatedProfile) {
                setUserProfile(updatedProfile);
            }
            
            return updatedProfile;
        } catch (error) {
            setError(error.detail || 'Ошибка обновления профиля');
            throw error;
        }
    };

    const changePassword = async (passwordData) => {
        try {
            setError(null);
            const result = await authService.changePassword(passwordData);
            return result;
        } catch (error) {
            setError(error.detail || 'Ошибка смены пароля');
            throw error;
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        setCurrentUser(null);
        setUserProfile(null);
    };

    const value = {
        currentUser,
        userProfile,
        loading,
        error,
        loginUser,
        registerUser,
        logoutUser,
        refreshUserToken,
        updateProfile,
        changePassword,
        fetchUserProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};