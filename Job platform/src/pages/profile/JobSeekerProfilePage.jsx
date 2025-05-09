import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../styles/Profile.css';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import ChangePasswordForm from '../../components/profile/ChangePasswordForm';
import EditProfileForm from '../../components/profile/EditProfileForm';
import NavigationBar from '../../components/NavigationBar';

function JobSeekerProfilePage() {
    const { currentUser, fetchUserProfile } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('personal');
    const [resume, setResume] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Получаем данные профиля соискателя
                const profileData = await authService.getJobSeekerProfile();
                setProfile(profileData);
                
                // Получаем резюме пользователя если есть
                try {
                    const resumeData = await authService.getUserResume();
                    if (resumeData && resumeData.length > 0) {
                        setResume(resumeData[0]);
                    }
                } catch (resumeError) {
                    console.log('Резюме не найдено или ошибка загрузки:', resumeError);
                }
                
                setLoading(false);
            } catch (err) {
                setError('Не удалось загрузить данные профиля');
                setLoading(false);
                console.error('Ошибка загрузки профиля:', err);
            }
        };

        if (currentUser) {
            fetchProfile();
        }
    }, [currentUser]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setIsEditing(false);
    };

    const handleEditProfileSuccess = (updatedProfile) => {
        setProfile(updatedProfile);
        setIsEditing(false);
        // Обновляем информацию о пользователе в контексте
        fetchUserProfile('jobseeker');
    };

    if (loading) {
        return (
            <div>
                <Header />
                <NavigationBar />
                <div className="container profile-container">
                    <div className="profile-loading">
                        <div className="loading-spinner"></div>
                        <p>Загрузка профиля...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header />
                <NavigationBar />
                <div className="container profile-container">
                    <div className="profile-error">
                        <h2>Ошибка</h2>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className="btn btn-primary">
                            Попробовать снова
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <NavigationBar />
            <div className="container profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {profile && profile.photo ? (
                            <img src={profile.photo} alt="Аватар пользователя" />
                        ) : (
                            <div className="avatar-placeholder">
                                {profile && profile.user.first_name ? profile.user.first_name.charAt(0) : '?'}
                            </div>
                        )}
                    </div>
                    <div className="profile-header-info">
                        <h1>{profile ? `${profile.user.first_name} ${profile.user.last_name}` : 'Имя не указано'}</h1>
                        <p className="profile-username">@{profile ? profile.user.username : ''}</p>
                        <div className="profile-status">
                            <span className="status-badge active">Ищу работу</span>
                        </div>
                    </div>
                </div>

                <div className="profile-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
                        onClick={() => handleTabClick('personal')}
                    >
                        Личные данные
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'resume' ? 'active' : ''}`}
                        onClick={() => handleTabClick('resume')}
                    >
                        Резюме
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'responses' ? 'active' : ''}`}
                        onClick={() => handleTabClick('responses')}
                    >
                        Отклики
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => handleTabClick('settings')}
                    >
                        Настройки
                    </button>
                </div>

                <div className="profile-content">
                    {activeTab === 'personal' && (
                        <div className="profile-section">
                            <div className="section-header">
                                <h2>Личные данные</h2>
                                {!isEditing && (
                                    <button 
                                        className="btn btn-outline" 
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Редактировать
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <EditProfileForm 
                                    initialData={profile} 
                                    onSuccess={handleEditProfileSuccess} 
                                />
                            ) : (
                                <div className="profile-data-grid">
                                    <div className="profile-data-item">
                                        <span className="data-label">Имя</span>
                                        <span className="data-value">{profile ? profile.user.first_name : '-'}</span>
                                    </div>
                                    <div className="profile-data-item">
                                        <span className="data-label">Фамилия</span>
                                        <span className="data-value">{profile ? profile.user.last_name : '-'}</span>
                                    </div>
                                    <div className="profile-data-item">
                                        <span className="data-label">Email</span>
                                        <span className="data-value">{profile ? profile.user.email : '-'}</span>
                                    </div>
                                    <div className="profile-data-item">
                                        <span className="data-label">Телефон</span>
                                        <span className="data-value">{profile && profile.user.phone ? profile.user.phone : 'Не указан'}</span>
                                    </div>
                                    <div className="profile-data-item full-width">
                                        <span className="data-label">О себе</span>
                                        <span className="data-value">{profile && profile.bio ? profile.bio : 'Информация отсутствует'}</span>
                                    </div>
                                    <div className="profile-data-item full-width">
                                        <span className="data-label">Дата регистрации</span>
                                        <span className="data-value">
                                            {profile ? new Date(profile.user.date_joined).toLocaleDateString('ru-RU') : '-'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'resume' && (
                        <div className="profile-section">
                            <h2>Резюме</h2>
                            {resume ? (
                                <div className="resume-card">
                                    <h3>{resume.title}</h3>
                                    <div className="resume-meta">
                                        <span className="resume-salary">{resume.salary_expectation} ₸</span>
                                        <span className="resume-experience">{resume.experience} лет опыта</span>
                                        <span className="resume-location">{resume.location}</span>
                                    </div>
                                    <p className="resume-description">{resume.description}</p>
                                    <div className="resume-skills">
                                        <h4>Навыки</h4>
                                        <div className="skills-list">
                                            {resume.skills.split(',').map((skill, index) => (
                                                <span key={index} className="skill-tag">{skill.trim()}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="resume-actions">
                                        <Link to={`/resume/edit/${resume.id}`} className="btn btn-primary">
                                            Редактировать резюме
                                        </Link>
                                        <button className="btn btn-secondary">Скачать PDF</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="resume-empty">
                                    <p>У вас еще нет резюме</p>
                                    <Link to="/resume/create" className="btn btn-primary">Создать резюме</Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'responses' && (
                        <div className="profile-section">
                            <h2>Мои отклики</h2>
                            <div className="responses-empty">
                                <p>У вас пока нет откликов на вакансии</p>
                                <Link to="/jobs" className="btn btn-primary">Найти вакансии</Link>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="profile-section">
                            <h2>Настройки аккаунта</h2>
                            
                            <ChangePasswordForm />
                            
                            <div className="settings-group">
                                <h3>Приватность</h3>
                                <div className="settings-toggle-group">
                                    <div className="toggle-item">
                                        <span>Публичное резюме</span>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked={true} />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="toggle-item">
                                        <span>Уведомления о новых вакансиях</span>
                                        <label className="switch">
                                            <input type="checkbox" />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                                <button className="btn btn-primary">Сохранить настройки</button>
                            </div>
                            <div className="settings-group danger-zone">
                                <h3>Опасная зона</h3>
                                <button className="btn btn-danger">Удалить аккаунт</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default JobSeekerProfilePage;