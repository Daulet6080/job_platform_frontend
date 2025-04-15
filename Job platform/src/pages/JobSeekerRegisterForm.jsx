// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/LogReg.css';

export default function JobSeekerRegisterForm({setLoggedIn, setUsername, onRegisterSuccess, onRegisterError}) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone: '',
        photo: null,
        confirmPassword: ''
    });

    JobSeekerRegisterForm.propTypes = {
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
        const {name, value, type} = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? e.target.files[0] : value
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
            newErrors.username = 'Имя пользователя должно содержать минимум 3 символа';
        }

        if (!formData.password) {
            newErrors.password = 'Введите пароль';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Введите email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (!agreeToTerms) {
            newErrors.terms = 'Необходимо согласиться с условиями';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const registrationData = new FormData();
            registrationData.append('username', formData.username);
            registrationData.append('password', formData.password);
            registrationData.append('email', formData.email);
            if (formData.phone) {
                registrationData.append('phone', formData.phone);
            }
            if (formData.photo) {
                registrationData.append('photo', formData.photo);
            }

            console.log('Данные регистрации соискателя (FormData):', registrationData);

            //  код отправки registrationData на бэк
            fetch('/api/users/register/jobseeker/', {
                method: 'POST',
                body: registrationData
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
                    console.log('Успешная регистрация:', data);
                    // Обработка успешной регистрации
                    const user = {
                        username: formData.username,
                        token: data.token, // Предполагается, что бэкенд возвращает токен
                        // expiresAt: new Date(data.expires_at), // Если бэкенд возвращает время жизни токена
                        role: 'jobseeker'
                    };

                    localStorage.setItem("user", JSON.stringify(user));
                    setLoggedIn(true);
                    setUsername(formData.username);
                    if (onRegisterSuccess) {
                        onRegisterSuccess(data.token, formData.username, 'jobseeker'); // Вызываем новую функцию
                    }
                    navigate('/jobseeker/dashboard'); // Перенаправляем на главную соискателя
                })
                .catch(error => {
                    console.error('Ошибка регистрации:', error);
                    setErrors({...errors, backend: error.message});
                    if (onRegisterError) {
                        onRegisterError(error.message); // Вызываем новую функцию обработки ошибки
                    }
                });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="auth-container">
            <div className="auth-background"></div>
            <div className="auth-panel">
                <div className="auth-left">
                    <div className="auth-branding">
                        <div className="brand-logo">JP</div>
                        <h1 className="brand-title">Job Platform</h1>
                        <p className="brand-subtitle">Создайте аккаунт и начните поиск работы мечты</p>

                        <div className="brand-features">
                            {/* ... */}
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <h2 className="auth-form-title">Регистрация соискателя</h2>
                        <p className="auth-form-subtitle">Заполните форму для регистрации</p>

                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Имя пользователя</label>
                            <div className="input-wrapper">
                                {/* ... */}
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
                            <label htmlFor="password" className="form-label">Пароль</label>
                            <div className="input-wrapper">
                                {/* ... */}
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
                                {/* ... */}
                            </div>
                            {errors.password && <p className="error-message">{errors.password}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Подтверждение пароля</label>
                            <div className="input-wrapper">
                                {/* ... */}
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

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <div className="input-wrapper">
                                {/* ... */}
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Введите email"
                                    className={`form-input ${errors.email ? 'invalid' : ''}`}
                                    required
                                />
                            </div>
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">Телефон (необязательно)</label>
                            <div className="input-wrapper">
                                {/* ... */}
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Введите номер телефона"
                                    className={`form-input ${errors.phone ? 'invalid' : ''}`}
                                />
                            </div>
                            {errors.phone && <p className="error-message">{errors.phone}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="photo" className="form-label">Фото (необязательно)</label>
                            <div className="input-wrapper">
                                <input
                                    id="photo"
                                    name="photo"
                                    type="file"
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.photo ? 'invalid' : ''}`}
                                />
                            </div>
                            {errors.photo && <p className="error-message">{errors.photo}</p>}
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