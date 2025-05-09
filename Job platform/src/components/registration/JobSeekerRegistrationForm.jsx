import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { authService } from '../../services/authService';
import '../../styles/LogReg.css';

function JobSeekerRegistrationForm({ onRegisterSuccess, onBack }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirm_password: '',
        email: '',
        phone: '',
        first_name: '',
        last_name: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Проверка имени пользователя
        if (!formData.username.trim()) {
            newErrors.username = 'Имя пользователя обязательно';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Имя пользователя должно содержать не менее 3 символов';
        }
        
        // Проверка пароля
        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов';
        }
        
        // Проверка подтверждения пароля
        if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = 'Пароли не совпадают';
        }
        
        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email обязателен';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }
        
        // Проверка телефона
        if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
            newErrors.phone = 'Введите корректный номер телефона';
        }
        
        // Проверка имени
        if (!formData.first_name.trim()) {
            newErrors.first_name = 'Имя обязательно';
        }
        
        // Проверка фамилии
        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Фамилия обязательна';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsLoading(true);
            try {
                // Отправляем только нужные поля
                const registrationData = {
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone || '',
                };
                
                const response = await authService.registerJobSeeker(registrationData);
                // Вызываем колбэк успешной регистрации с данными пользователя и токеном из ответа
                onRegisterSuccess(registrationData);
            } catch (error) {
                // Обрабатываем ошибки от API
                if (error.response && error.response.data) {
                    const apiErrors = {};
                    Object.entries(error.response.data).forEach(([key, value]) => {
                        apiErrors[key] = Array.isArray(value) ? value[0] : value;
                    });
                    setErrors(apiErrors);
                } else {
                    setErrors({
                        general: 'Произошла ошибка при регистрации. Попробуйте еще раз.'
                    });
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-background"></div>
            <div className="auth-panel">
                <div className="auth-left">
                    <div className="auth-branding">
                        <div className="brand-logo">JP</div>
                        <h1 className="brand-title">Job Platform</h1>
                        <p className="brand-subtitle">Регистрация соискателя</p>

                        <div className="brand-features">
                            <div className="brand-feature-item">
                                <div className="brand-feature-icon">
                                    <svg viewBox="0 0 24 24" width="14" height="14">
                                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                </div>
                                <span className="brand-feature-text">Создайте профессиональное резюме</span>
                            </div>
                            <div className="brand-feature-item">
                                <div className="brand-feature-icon">
                                    <svg viewBox="0 0 24 24" width="14" height="14">
                                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                </div>
                                <span className="brand-feature-text">Откликайтесь на вакансии в один клик</span>
                            </div>
                            <div className="brand-feature-item">
                                <div className="brand-feature-icon">
                                    <svg viewBox="0 0 24 24" width="14" height="14">
                                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                </div>
                                <span className="brand-feature-text">Получайте предложения от работодателей</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <form className="auth-form registration-form" onSubmit={handleSubmit}>
                        <button type="button" className="back-button" onClick={onBack}>
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                            </svg>
                            <span>Назад</span>
                        </button>
                        <h2 className="auth-form-title">Регистрация соискателя</h2>
                        <p className="auth-form-subtitle">Создайте аккаунт для поиска работы</p>

                        {errors.general && (
                            <div className="error-message general-error">{errors.general}</div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="first_name" className="form-label">Имя</label>
                                <div className="input-wrapper">
                                    <input
                                        id="first_name"
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        placeholder="Введите ваше имя"
                                        className={`form-input ${errors.first_name ? 'invalid' : ''}`}
                                    />
                                </div>
                                {errors.first_name && <p className="error-message">{errors.first_name}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="last_name" className="form-label">Фамилия</label>
                                <div className="input-wrapper">
                                    <input
                                        id="last_name"
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        placeholder="Введите вашу фамилию"
                                        className={`form-input ${errors.last_name ? 'invalid' : ''}`}
                                    />
                                </div>
                                {errors.last_name && <p className="error-message">{errors.last_name}</p>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Имя пользователя</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18">
                                    <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Введите имя пользователя"
                                    className={`form-input ${errors.username ? 'invalid' : ''}`}
                                />
                            </div>
                            {errors.username && <p className="error-message">{errors.username}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18">
                                    <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                </svg>
                                <input
                                    id="email"
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Введите ваш email"
                                    className={`form-input ${errors.email ? 'invalid' : ''}`}
                                />
                            </div>
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">Телефон (необязательно)</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18">
                                    <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                </svg>
                                <input
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Введите номер телефона"
                                    className={`form-input ${errors.phone ? 'invalid' : ''}`}
                                />
                            </div>
                            {errors.phone && <p className="error-message">{errors.phone}</p>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Пароль</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18">
                                        <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                    </svg>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Введите пароль"
                                        className={`form-input ${errors.password ? 'invalid' : ''}`}
                                    />
                                </div>
                                {errors.password && <p className="error-message">{errors.password}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirm_password" className="form-label">Подтверждение пароля</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18">
                                        <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                    </svg>
                                    <input
                                        id="confirm_password"
                                        type="password"
                                        name="confirm_password"
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        placeholder="Подтвердите пароль"
                                        className={`form-input ${errors.confirm_password ? 'invalid' : ''}`}
                                    />
                                </div>
                                {errors.confirm_password && <p className="error-message">{errors.confirm_password}</p>}
                            </div>
                        </div>

                        <div className="form-group form-actions">
                            <button
                                type="submit"
                                className="auth-button"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                            </button>
                        </div>

                        <div className="auth-divider">
                            <span>или</span>
                        </div>

                        <p className="auth-switch-text">
                            Уже есть аккаунт? <Link to="/login" className="auth-link">Войти</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

JobSeekerRegistrationForm.propTypes = {
    onRegisterSuccess: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
};

export default JobSeekerRegistrationForm;