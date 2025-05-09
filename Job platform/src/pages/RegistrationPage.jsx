import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LogReg.css';
import JobSeekerRegistrationForm from '../components/registration/JobSeekerRegistrationForm';
import EmployerRegistrationForm from '../components/registration/EmployerRegistrationForm';
import { AuthContext } from '../context/AuthContext';

function RegistrationPage() {
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const { registerUser } = useContext(AuthContext);

    const handleRoleSelect = (role) => {
        setUserRole(role);
    };

    const handleBackToRoleSelection = () => {
        setUserRole(null);
    };

    const handleRegisterSuccess = async (userData, role) => {
        try {
            console.log(`Регистрация пользователя с ролью ${role}:`, userData);
            
            // Важно использовать await, чтобы перехватить ошибки
            await registerUser(userData, role);
            
            // Перенаправляем только после успешной регистрации
            setTimeout(() => {
                if (role === 'employer') {
                    navigate('/profile/employer');
                } else {
                    navigate('/profile/jobseeker');
                }
            }, 500);
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            // Обработка ошибки уже происходит в компоненте формы
        }
    };

    let content;
    if (!userRole) {
        content = (
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
                        <div className="role-selection">
                            <h2 className="auth-form-title">Регистрация</h2>
                            <p className="auth-form-subtitle">Выберите тип аккаунта</p>

                            <div className="role-options">
                                <button 
                                    className="role-option"
                                    onClick={() => handleRoleSelect('jobseeker')}
                                >
                                    <svg viewBox="0 0 24 24" width="48" height="48">
                                        <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                    <h3 className="role-title">Соискатель</h3>
                                    <p className="role-description">Ищете работу? Создайте резюме и откликайтесь на вакансии</p>
                                </button>

                                <button 
                                    className="role-option"
                                    onClick={() => handleRoleSelect('employer')}
                                >
                                    <svg viewBox="0 0 24 24" width="48" height="48">
                                        <path fill="currentColor" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                                    </svg>
                                    <h3 className="role-title">Работодатель</h3>
                                    <p className="role-description">Ищете сотрудников? Размещайте вакансии и находите кандидатов</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if (userRole === 'jobseeker') {
        content = <JobSeekerRegistrationForm 
                    onRegisterSuccess={(userData) => handleRegisterSuccess(userData, 'jobseeker')} 
                    onBack={handleBackToRoleSelection} 
                  />;
    } else {
        content = <EmployerRegistrationForm 
                    onRegisterSuccess={(userData) => handleRegisterSuccess(userData, 'employer')} 
                    onBack={handleBackToRoleSelection} 
                  />;
    }

    return content;
}

export default RegistrationPage;