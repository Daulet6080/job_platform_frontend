import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LogReg.css';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();
    
    const { loginUser } = useContext(AuthContext);

    const validateForm = () => {
        let isValid = true;

        if (!username.trim()) {
            setUsernameError("Введите имя пользователя");
            isValid = false;
        } else {
            setUsernameError("");
        }

        if (!password) {
            setPasswordError("Введите пароль");
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError("Пароль должен содержать минимум 6 символов");
            isValid = false;
        } else {
            setPasswordError("");
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setLoginError("");
                const user = await loginUser(username, password, rememberMe);
                
                // Перенаправление в зависимости от роли
                if (user.role === 'employer') {
                    navigate('/employer/dashboard');
                } else if (user.role === 'jobseeker') {
                    navigate('/jobseeker/dashboard');
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error("Ошибка авторизации:", error);
                setLoginError("Неверное имя пользователя или пароль");
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
                        <p className="brand-subtitle">Платформа для поиска работы вашей мечты</p>

                        <div className="brand-features">
                            <div className="brand-feature-item">
                                <div className="brand-feature-icon">
                                    <svg viewBox="0 0 24 24" width="14" height="14">
                                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                </div>
                                <span className="brand-feature-text">Более 10,000 актуальных вакансий</span>
                            </div>
                            <div className="brand-feature-item">
                                <div className="brand-feature-icon">
                                    <svg viewBox="0 0 24 24" width="14" height="14">
                                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                </div>
                                <span className="brand-feature-text">Прямой контакт с работодателями</span>
                            </div>
                            <div className="brand-feature-item">
                                <div className="brand-feature-icon">
                                    <svg viewBox="0 0 24 24" width="14" height="14">
                                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                </div>
                                <span className="brand-feature-text">Бесплатное размещение резюме</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <h2 className="auth-form-title">Вход в аккаунт</h2>
                        <p className="auth-form-subtitle">Рады видеть вас снова</p>

                        {loginError && <div className="error-message login-error">{loginError}</div>}

                        <div className="social-login">
                            <button type="button" className="social-btn" aria-label="Войти через Google">
                                <svg viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                                </svg>
                            </button>
                            <button type="button" className="social-btn" aria-label="Войти через Facebook">
                                <svg viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M13.397,20.997v-8.196h2.765l0.411-3.209h-3.176V7.548c0-0.926,0.258-1.56,1.587-1.56h1.684V3.127 C15.849,3.039,15.025,2.997,14.201,3c-2.444,0-4.122,1.492-4.122,4.231v2.355H7.332v3.209h2.753v8.202H13.397z"/>
                                </svg>
                            </button>
                            <button type="button" className="social-btn" aria-label="Войти через Apple">
                                <svg viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12.152,6.896c-0.948,0-2.415-1.078-3.96-1.04C6.516,5.894,5.048,6.916,4.252,8.498 c-1.596,2.784-0.408,6.9,1.136,9.148c0.756,1.098,1.676,2.324,2.868,2.28c1.136-0.048,1.588-0.748,2.976-0.748 c1.388,0,1.798,0.748,3.024,0.72c1.256-0.020,2.044-1.148,2.812-2.248c0.884-1.288,1.24-2.552,1.26-2.62 c-0.016-0.020-2.476-0.948-2.496-3.76c-0.018-2.356,1.932-3.476,2.016-3.538C16.984,6.334,15.078,4.81,12.152,6.896z M14.856,3.648 c0.628-0.76,1.048-1.812,0.94-2.868C14.828,0.804,14.024,0.18,13.13,0C12.7,0.084,11.964,0.352,11.504,0.94 c-0.556,0.672-1.008,1.748-0.88,2.788C11.604,3.776,12.468,4.4,14.856,3.648z"/>
                                </svg>
                            </button>
                        </div>

                        <div className="auth-divider">
                            <span>или</span>
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
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="Введите имя пользователя"
                                    className={`form-input ${usernameError ? 'invalid' : ''}`}
                                    autoComplete="username"
                                />
                            </div>
                            {usernameError && <p className="error-message">{usernameError}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Пароль</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18">
                                    <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                </svg>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Введите пароль"
                                    className={`form-input ${passwordError ? 'invalid' : ''}`}
                                    autoComplete="current-password"
                                />
                            </div>
                            {passwordError && <p className="error-message">{passwordError}</p>}
                        </div>

                        <div className="remember-me">
                            <label className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    className="checkbox-input"
                                    checked={rememberMe}
                                    onChange={e => setRememberMe(e.target.checked)}
                                />
                                <span className="checkbox-custom"></span>
                                <span className="checkbox-label">Запомнить меня</span>
                            </label>
                        </div>

                        <div className="form-group form-actions">
                            <button
                                type="submit"
                                className="auth-button"
                            >
                                Войти
                            </button>
                        </div>

                        <p className="auth-help-text">
                            <Link to="/forgot-password" className="auth-link">Забыли пароль?</Link>
                        </p>

                        <div className="auth-divider">
                            <span>или</span>
                        </div>

                        <p className="auth-switch-text">
                            Нет аккаунта? <Link to="/signup" className="auth-link">Зарегистрироваться</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}