// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import JobSeekerRegisterForm from './JobSeekerRegisterForm';
import EmployerRegisterForm from './EmployerRegisterForm';
import '../styles/logReg.css';
import '../styles/RegistrationPage.css';
import PropTypes from "prop-types";

function RegistrationPage({setLoggedIn, setUsername}) {
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        setUserRole(role);
    };

    const handleRegisterSuccess = (token, username, role) => {
        localStorage.setItem('user', JSON.stringify({
            token,
            username,
            role,
            expiresAt: new Date(Date.now() + 3600000)
        }));
        setLoggedIn(true);
        setUsername(username);
        setUserRole(role);
        if (role === 'jobseeker') {
            navigate('/jobseeker/dashboard');
        } else if (role === 'employer') {
            navigate('/employer/dashboard');
        }
    };

    const handleRegisterError = (error) => {
        console.error('Ошибка регистрации:', error);
        // Здесь можно реализовать отображение сообщения об ошибке пользователю желание болса
        // Например, установить какое-то состояние ошибки и отобразить его в UI тоже по желнаию гой брат
    };

    RegistrationPage.propTypes = {
        setLoggedIn: PropTypes.func.isRequired,
        setUsername: PropTypes.func.isRequired,
    };

    let content;
    if (!userRole) {
        content = (
            <div className="role-selection-container">
                <h2 className="auth-form-title">Выберите тип аккаунта</h2>
                <div className="role-buttons">
                    <button className="auth-button" onClick={() => handleRoleSelect('jobseeker')}>
                        Я соискатель
                    </button>
                    <button className="auth-button" onClick={() => handleRoleSelect('employer')}>
                        Я работодатель
                    </button>
                </div>
                <p className="auth-switch-text">Уже есть аккаунт? <Link to="/login" className="auth-link">Войти</Link>
                </p>
            </div>
        );
    } else if (userRole === 'jobseeker') {
        content = (
            <div className="auth-form">
                <h2 className="auth-form-title">Регистрация соискателя</h2>
                <JobSeekerRegisterForm
                    onRegisterSuccess={handleRegisterSuccess}
                    onRegisterError={handleRegisterError}
                    // Больше не передаем setLoggedIn и setUsername напрямую
                />
            </div>
        );
    } else if (userRole === 'employer') {
        content = (
            <div className="auth-form">
                <h2 className="auth-form-title">Регистрация работодателя</h2>
                <EmployerRegisterForm
                    onRegisterSuccess={handleRegisterSuccess}
                    onRegisterError={handleRegisterError}
                    // Больше не передаем setLoggedIn и setUsername напрямую
                />
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-background"></div>
            <div className="auth-panel">
                <div className="auth-left">
                    <div className="auth-branding">
                        <div className="brand-logo">JP</div>
                        <h1 className="brand-title">Job Platform</h1>
                        <p className="brand-subtitle">Выберите тип аккаунта для регистрации</p>
                    </div>
                </div>
                <div className="auth-right">
                    {content}
                </div>
            </div>
        </div>
    );
}

export default RegistrationPage;