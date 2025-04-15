// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LogReg.css';

export default function EmployerRegisterForm({ setLoggedIn, setUsername, onRegisterSuccess, onRegisterError }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        joinType: 'create',
        companyName: '',
        companyId: '',
        confirmPassword: ''
    });

    EmployerRegisterForm.propTypes = {
        setLoggedIn: PropTypes.func.isRequired,
        setUsername: PropTypes.func.isRequired,
        onRegisterSuccess: PropTypes.func,
        onRegisterError: PropTypes.func,
    };

    const [errors, setErrors] = useState({});
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
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

        if (!formData.username.trim()) {
            newErrors.username = 'Введите имя пользователя';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Имя пользователя должен содержать минимум 3 символа';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Введите email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (!formData.password) {
            newErrors.password = 'Введите пароль';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        if (!agreeToTerms) {
            newErrors.terms = 'Необходимо согласиться с условиями';
        }

        if (formData.joinType === 'create' && !formData.companyName.trim()) {
            newErrors.companyName = 'Введите название компании';
        }

        if (formData.joinType === 'join' && !formData.companyId) {
            newErrors.companyId = 'Введите ID компании';
        } else if (formData.joinType === 'join' && isNaN(formData.companyId)) {
            newErrors.companyId = 'ID компании должен быть числом';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const registrationData = {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                join_type: formData.joinType,
                company_name: formData.companyName,
                company_id: formData.companyId ? parseInt(formData.companyId, 10) : null,
            };

            console.log('Данные регистрации работодателя:', registrationData);

            fetch('/api/users/register/employer/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrationData)
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            throw new Error(data ? JSON.stringify(data) : `Ошибка регистрации: ${response.status}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Успешная регистрация работодателя:', data);
                    const user = {
                        username: formData.username,
                        token: data.token, // Предполагаем что бэкенд возвращает токен
                        role: 'employer'
                    };
                    localStorage.setItem("user", JSON.stringify(user));
                    setLoggedIn(true);
                    setUsername(formData.username);
                    if (onRegisterSuccess) {
                        onRegisterSuccess(data.token, formData.username, 'employer'); // Вызываем новую функцию
                    }
                    navigate('/employer/dashboard'); // Перенаправляем на главную работодателя
                })
                .catch(error => {
                    console.error('Ошибка регистрации работодателя:', error);
                    setErrors({ ...errors, backend: error.message });
                    if (onRegisterError) {
                        onRegisterError(error.message); // Вызываем новую функцию обработки ошибки
                    }
                });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleJoinTypeChange = (e) => {
        setFormData({ ...formData, joinType: e.target.value, companyName: '', companyId: '' });
    };

    return (
        <div className="auth-container">
            <div className="auth-background"></div>
            <div className="auth-panel">
                <div className="auth-left">
                    <div className="auth-branding">
                        <div className="brand-logo">JP</div>
                        <h1 className="brand-title">Job Platform для Работодателей</h1>
                        <p className="brand-subtitle">Присоединяйтесь к нашей платформе и находите лучших специалистов</p>
                    </div>
                </div>

                <div className="auth-right">
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <h2 className="auth-form-title">Регистрация Работодателя</h2>
                        <p className="auth-form-subtitle">Заполните форму для регистрации</p>

                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Имя пользователя</label>
                            <div className="input-wrapper">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Выберите имя пользователя"
                                    className={`form-input ${errors.username ? 'invalid' : ''}`}
                                    required
                                />
                            </div>
                            {errors.username && <p className="error-message">{errors.username}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <div className="input-wrapper">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Введите email компании"
                                    className={`form-input ${errors.email ? 'invalid' : ''}`}
                                    required
                                />
                            </div>
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Тип регистрации</label>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="joinType"
                                        value="create"
                                        checked={formData.joinType === 'create'}
                                        onChange={handleJoinTypeChange}
                                        className="form-radio"
                                    />
                                    Создать компанию
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="joinType"
                                        value="join"
                                        checked={formData.joinType === 'join'}
                                        onChange={handleJoinTypeChange}
                                        className="form-radio"
                                    />
                                    Присоединиться к компании
                                </label>
                            </div>
                        </div>

                        {formData.joinType === 'create' && (
                            <div className="form-group">
                                <label htmlFor="companyName" className="form-label">Название компании</label>
                                <div className="input-wrapper">
                                    <input
                                        id="companyName"
                                        name="companyName"
                                        type="text"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        placeholder="Введите название компании"
                                        className={`form-input ${errors.companyName ? 'invalid' : ''}`}
                                        required={formData.joinType === 'create'}
                                    />
                                </div>
                                {errors.companyName && <p className="error-message">{errors.companyName}</p>}
                            </div>
                        )}

                        {formData.joinType === 'join' && (
                            <div className="form-group">
                                <label htmlFor="companyId" className="form-label">ID компании</label>
                                <div className="input-wrapper">
                                    <input
                                        id="companyId"
                                        name="companyId"
                                        type="number"
                                        value={formData.companyId}
                                        onChange={handleInputChange}
                                        placeholder="Введите ID компании"
                                        className={`form-input ${errors.companyId ? 'invalid' : ''}`}
                                        required={formData.joinType === 'join'}
                                    />
                                </div>
                                {errors.companyId && <p className="error-message">{errors.companyId}</p>}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Пароль</label>
                            <div className="input-wrapper">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Создайте пароль"
                                    className={`form-input ${errors.password ? 'invalid' : ''}`}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        // Иконка "показать пароль" (замените на свой SVG или компонент)
                                        <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
                                    ) : (
                                        // Иконка "скрыть пароль" (замените на свой SVG или компонент)
                                        <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="error-message">{errors.password}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Подтверждение пароля</label>
                            <div className="input-wrapper">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Повторите пароль"
                                    className={`form-input ${errors.confirmPassword ? 'invalid' : ''}`}
                                    required
                                />
                            </div>
                            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                        </div>

                        <div className="remember-me">
                            <label className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    className="checkbox-input"
                                    checked={agreeToTerms}
                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                />
                                <span className="checkbox-custom"></span>
                                <span className="checkbox-label">Я согласен с <Link to="/terms" className="auth-link">условиями использования</Link></span>
                            </label>
                        </div>
                        {errors.terms && <p className="error-message">{errors.terms}</p>}

                        {errors.backend && <p className="error-message backend-error">{errors.backend}</p>}

                        <div className="form-group form-actions">
                            <button
                                type="submit"
                                className="auth-button"
                            >
                                Зарегистрироваться
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