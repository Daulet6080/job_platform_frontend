import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { authService } from '../../services/authService';
import '../../styles/LogReg.css';

function EmployerRegistrationForm({ onRegisterSuccess, onBack }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirm_password: '',
        email: '',
        phone: '',
        first_name: '',
        last_name: '',
        company_name: '',
        company_description: '',
        company_website: '',
        company_address: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
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
        
        // Проверка названия компании
        if (!formData.company_name.trim()) {
            newErrors.company_name = 'Название компании обязательно';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsLoading(true);
            try {
                const registrationData = {
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone || '',
                    company: {
                        name: formData.company_name,
                        description: formData.company_description || '',
                        website: formData.company_website || '',
                        address: formData.company_address || ''
                    }
                };
                
                const response = await authService.registerEmployer(registrationData);
                // Вызываем колбэк успешной регистрации
                onRegisterSuccess(registrationData);
            } catch (error) {
                // Обрабатываем ошибки от API
                if (error.response && error.response.data) {
                    const apiErrors = {};
                    // Обработка вложенных ошибок для компании
                    if (error.response.data.company) {
                        Object.entries(error.response.data.company).forEach(([key, value]) => {
                            apiErrors[`company_${key}`] = Array.isArray(value) ? value[0] : value;
                        });
                    }
                    
                    // Обработка обычных ошибок
                    Object.entries(error.response.data).forEach(([key, value]) => {
                        if (key !== 'company') {
                            apiErrors[key] = Array.isArray(value) ? value[0] : value;
                        }
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
                        <p className="brand-subtitle">Регистрация работодателя</p>

                        <div className="brand-features">
                            <div className="brand-feature-item">
                                <div className="brand-feature-icon">
                                    <svg viewBox="0 0 24 24" width="14" height="14">
                                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                </div>
                                <span className="brand-feature-text">Размещайте вакансии и получайте отклики</span>
                            </div>
                            <div className="brand-feature-item">
                                <div className="brand-feature-icon">
                                    <svg viewBox="0 0 24 24" width="14" height="14">
                                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                </div>
                                <span className="brand-feature-text">Ищите подходящих кандидатов в базе резюме</span>
                            </div>
                            <div className="brand-feature-item">
                                <div className="brand-feature-icon">
                                    <svg viewBox="0 0 24 24" width="14" height="14">
                                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                </div>
                                <span className="brand-feature-text">Управляйте процессом найма в одном месте</span>
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
                        <h2 className="auth-form-title">Регистрация работодателя</h2>
                        <p className="auth-form-subtitle">Создайте аккаунт для поиска сотрудников</p>

                        {errors.general && (
                            <div className="error-message general-error">{errors.general}</div>
                        )}

                        <h3 className="form-section-title">Персональные данные</h3>
                        
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

                        <div className="form-row">
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
                                <label htmlFor="phone" className="form-label">Телефон</label>
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

                        <h3 className="form-section-title">Информация о компании</h3>

                        <div className="form-group">
                            <label htmlFor="company_name" className="form-label">Название компании</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18">
                                    <path fill="currentColor" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                                </svg>
                                <input
                                    id="company_name"
                                    type="text"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    placeholder="Введите название компании"
                                    className={`form-input ${errors.company_name ? 'invalid' : ''}`}
                                />
                            </div>
                            {errors.company_name && <p className="error-message">{errors.company_name}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="company_description" className="form-label">Описание компании (необязательно)</label>
                            <div className="input-wrapper textarea-wrapper">
                                <textarea
                                    id="company_description"
                                    name="company_description"
                                    value={formData.company_description}
                                    onChange={handleChange}
                                    placeholder="Введите краткое описание компании"
                                    className={`form-input ${errors.company_description ? 'invalid' : ''}`}
                                    rows={3}
                                ></textarea>
                            </div>
                            {errors.company_description && <p className="error-message">{errors.company_description}</p>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="company_website" className="form-label">Веб-сайт (необязательно)</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18">
                                        <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
                                    </svg>
                                    <input
                                        id="company_website"
                                        type="text"
                                        name="company_website"
                                        value={formData.company_website}
                                        onChange={handleChange}
                                        placeholder="Например: https://example.com"
                                        className={`form-input ${errors.company_website ? 'invalid' : ''}`}
                                    />
                                </div>
                                {errors.company_website && <p className="error-message">{errors.company_website}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="company_address" className="form-label">Адрес (необязательно)</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18">
                                        <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    <input
                                        id="company_address"
                                        type="text"
                                        name="company_address"
                                        value={formData.company_address}
                                        onChange={handleChange}
                                        placeholder="Введите адрес компании"
                                        className={`form-input ${errors.company_address ? 'invalid' : ''}`}
                                    />
                                </div>
                                {errors.company_address && <p className="error-message">{errors.company_address}</p>}
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

EmployerRegistrationForm.propTypes = {
    onRegisterSuccess: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
};

export default EmployerRegistrationForm;