import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../styles/Profile.css';
import { AuthContext } from '../../context/AuthContext';
import axiosAPI from '../../utils/axiosInterceptor';
import ChangePasswordForm from '../../components/profile/ChangePasswordForm';
import { authService } from '../../services/authService';
import ConfirmModal from '../../components/common/ConfirmModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function EmployerProfilePage() {
    const { currentUser, updateUserProfile } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [company, setCompany] = useState(null);
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('company');
    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editCompanyMode, setEditCompanyMode] = useState(false);
    const [formSuccess, setFormSuccess] = useState('');
    
    // Состояние для формы персональных данных
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    });
    
    // Состояние для формы компании
    const [companyFormData, setCompanyFormData] = useState({
        name: '',
        industry: '',
        size: '',
        founded_year: '',
        website: '',
        address: '',
        description: ''
    });
    
    // Состояние для настроек уведомлений
    const [notificationSettings, setNotificationSettings] = useState({
        new_responses: true,
        email_notifications: false
    });
    
    const navigate = useNavigate();

    // Загрузка данных профиля, компании и вакансий
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Получаем данные профиля работодателя
            const profileResponse = await authService.getEmployerProfile();
            setProfile(profileResponse);
            
            // Инициализируем форму персональных данных
            setFormData({
                first_name: profileResponse.user.first_name || '',
                last_name: profileResponse.user.last_name || '',
                email: profileResponse.user.email || '',
                phone: profileResponse.user.phone || ''
            });
            
            // Получаем данные о компании
            if (profileResponse.company) {
                const companyResponse = await authService.getCompanyDetails(profileResponse.company);
                setCompany(companyResponse);
                
                // Инициализируем форму компании
                setCompanyFormData({
                    name: companyResponse.name || '',
                    industry: companyResponse.industry || '',
                    size: companyResponse.size || '',
                    founded_year: companyResponse.founded_year || '',
                    website: companyResponse.website || '',
                    address: companyResponse.address || '',
                    description: companyResponse.description || ''
                });
                
                // Получаем вакансии компании
                const vacanciesResponse = await authService.getCompanyVacancies(profileResponse.company);
                setVacancies(vacanciesResponse.results || []);
            }
            
            setLoading(false);
        } catch (err) {
            setError('Не удалось загрузить данные профиля');
            setLoading(false);
            console.error('Ошибка загрузки профиля:', err);
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchData();
        }
    }, [currentUser, fetchData]);

    // Обработчик изменения активной вкладки
    const handleTabClick = (tab) => {
        setActiveTab(tab);
        // Сбросить режим редактирования при переключении вкладок
        setEditMode(false);
        setEditCompanyMode(false);
        
        // Сбросить сообщение об успешном обновлении
        setFormSuccess('');
    };

    // Обработчик изменений полей формы персональных данных
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Обработчик изменений полей формы компании
    const handleCompanyInputChange = (e) => {
        const { id, value } = e.target;
        setCompanyFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Обработчик изменений настроек уведомлений
    const handleNotificationChange = (key) => {
        setNotificationSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Отправка формы персональных данных
    const handlePersonalFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError(null);
        
        try {
            const updatedData = {
                user: {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    phone: formData.phone
                }
            };
            
            await authService.updateEmployerProfile(updatedData);
            
            // Показать успешное сообщение
            setFormSuccess('Личные данные успешно обновлены');
            
            // Обновить данные в контексте
            if (updateUserProfile) {
                updateUserProfile();
            }
            
            // Перезагрузить профиль
            await fetchData();
            
            // Выйти из режима редактирования
            setEditMode(false);
            
            toast.success('Персональные данные успешно обновлены');
        } catch (err) {
            setError('Ошибка при обновлении данных: ' + (err.message || 'Неизвестная ошибка'));
            toast.error('Ошибка при обновлении данных');
        } finally {
            setFormLoading(false);
        }
    };

    // Отправка формы компании
    const handleCompanyFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError(null);
        
        try {
            const updatedData = {
                name: companyFormData.name,
                industry: companyFormData.industry,
                size: companyFormData.size,
                founded_year: companyFormData.founded_year || null,
                website: companyFormData.website,
                address: companyFormData.address,
                description: companyFormData.description
            };
            
            if (company && company.id) {
                // Обновление существующей компании
                await axiosAPI.patch(`companies/company/${company.id}/`, updatedData);
            } else {
                // Создание новой компании
                const response = await axiosAPI.post('companies/company/', updatedData);
                
                // Привязка компании к профилю работодателя
                await axiosAPI.patch('users/profile/employer/', {
                    company: response.data.id
                });
            }
            
            setFormSuccess('Информация о компании успешно обновлена');
            
            // Перезагрузить профиль
            await fetchData();
            
            // Выйти из режима редактирования
            setEditCompanyMode(false);
            
            toast.success('Информация о компании успешно обновлена');
        } catch (err) {
            setError('Ошибка при обновлении компании: ' + (err.message || 'Неизвестная ошибка'));
            toast.error('Ошибка при обновлении информации о компании');
        } finally {
            setFormLoading(false);
        }
    };

    // Сохранение настроек уведомлений
    const handleSaveNotificationSettings = async () => {
        setFormLoading(true);
        
        try {
            // Здесь будет API запрос для сохранения настроек уведомлений
            await axiosAPI.put('notifications/settings/', notificationSettings);
            
            setFormSuccess('Настройки уведомлений успешно сохранены');
            toast.success('Настройки уведомлений успешно обновлены');
        } catch (err) {
            setError('Ошибка при обновлении настроек');
            toast.error('Не удалось обновить настройки уведомлений');
        } finally {
            setFormLoading(false);
        }
    };

    // Активация/деактивация вакансии
    const toggleVacancyStatus = async (vacancyId, isActive) => {
        try {
            await axiosAPI.patch(`vacancies/${vacancyId}/`, {
                is_active: !isActive
            });
            
            // Обновляем локальное состояние вакансий
            setVacancies(prev => prev.map(v => 
                v.id === vacancyId ? {...v, is_active: !isActive} : v
            ));
            
            toast.success(isActive ? 'Вакансия деактивирована' : 'Вакансия активирована');
        } catch (err) {
            toast.error(`Ошибка при ${isActive ? 'деактивации' : 'активации'} вакансии`);
        }
    };

    // Удаление аккаунта
    const handleDeleteAccount = async () => {
        try {
            await axiosAPI.delete('users/delete/');
            
            // Выйти из системы
            if (currentUser && currentUser.logoutUser) {
                await currentUser.logoutUser();
            }
            
            // Перенаправить на главную страницу
            navigate('/');
            toast.info('Ваш аккаунт был удален');
        } catch (err) {
            toast.error('Ошибка при удалении аккаунта');
        } finally {
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
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
                <div className="container profile-container">
                    <div className="profile-error">
                        <h2>Ошибка</h2>
                        <p>{error}</p>
                        <button onClick={() => fetchData()} className="btn btn-primary">
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
            <div className="container profile-container">
                <div className="profile-header employer-profile-header">
                    <div className="company-logo">
                        {company && company.logo ? (
                            <img src={company.logo} alt={company.name} />
                        ) : (
                            <div className="company-logo-placeholder">
                                {company ? company.name.charAt(0) : 'C'}
                            </div>
                        )}
                    </div>
                    <div className="profile-header-info">
                        <h1>{company ? company.name : 'Название компании не указано'}</h1>
                        <p className="profile-username">@{profile ? profile.user.username : ''}</p>
                        <div className="company-meta">
                            {company && company.website && (
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="company-website">
                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                        <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
                                    </svg>
                                    {company.website}
                                </a>
                            )}
                            {company && company.address && (
                                <span className="company-address">
                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                        <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    {company.address}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="profile-actions">
                        <Link to="/vacancies/create" className="btn btn-primary">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                            Создать вакансию
                        </Link>
                    </div>
                </div>

                <div className="profile-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'company' ? 'active' : ''}`}
                        onClick={() => handleTabClick('company')}
                    >
                        О компании
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'vacancies' ? 'active' : ''}`}
                        onClick={() => handleTabClick('vacancies')}
                    >
                        Вакансии
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
                    {activeTab === 'company' && (
                        <div className="profile-section">
                            <div className="section-header">
                                <h2>Информация о компании</h2>
                                {company && !editCompanyMode && (
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => setEditCompanyMode(true)}
                                    >
                                        <svg viewBox="0 0 24 24" width="16" height="16">
                                            <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                        </svg>
                                        Редактировать
                                    </button>
                                )}
                            </div>
                            
                            {editCompanyMode ? (
                                // Форма редактирования информации о компании
                                <form className="company-edit-form" onSubmit={handleCompanyFormSubmit}>
                                    {formSuccess && (
                                        <div className="success-message">
                                            {formSuccess}
                                        </div>
                                    )}
                                    
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="name">Название компании*</label>
                                            <input 
                                                type="text" 
                                                id="name" 
                                                className="form-input" 
                                                value={companyFormData.name}
                                                onChange={handleCompanyInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="industry">Отрасль</label>
                                            <input 
                                                type="text" 
                                                id="industry" 
                                                className="form-input" 
                                                value={companyFormData.industry}
                                                onChange={handleCompanyInputChange}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="size">Размер компании</label>
                                            <select 
                                                id="size" 
                                                className="form-input" 
                                                value={companyFormData.size}
                                                onChange={handleCompanyInputChange}
                                            >
                                                <option value="">Выберите размер</option>
                                                <option value="1-10">1-10 сотрудников</option>
                                                <option value="11-50">11-50 сотрудников</option>
                                                <option value="51-200">51-200 сотрудников</option>
                                                <option value="201-500">201-500 сотрудников</option>
                                                <option value="501+">501+ сотрудников</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="founded_year">Год основания</label>
                                            <input 
                                                type="number" 
                                                id="founded_year" 
                                                className="form-input" 
                                                value={companyFormData.founded_year}
                                                onChange={handleCompanyInputChange}
                                                min="1900"
                                                max={new Date().getFullYear()}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="website">Веб-сайт</label>
                                            <input 
                                                type="url" 
                                                id="website" 
                                                className="form-input" 
                                                value={companyFormData.website}
                                                onChange={handleCompanyInputChange}
                                                placeholder="https://"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="address">Адрес</label>
                                            <input 
                                                type="text" 
                                                id="address" 
                                                className="form-input" 
                                                value={companyFormData.address}
                                                onChange={handleCompanyInputChange}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="description">Описание компании</label>
                                        <textarea 
                                            id="description" 
                                            className="form-input" 
                                            rows="6"
                                            value={companyFormData.description}
                                            onChange={handleCompanyInputChange}
                                        />
                                    </div>
                                    
                                    <div className="form-actions">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary" 
                                            onClick={() => {
                                                setEditCompanyMode(false);
                                                setFormSuccess('');
                                                // Восстанавливаем исходные данные
                                                if (company) {
                                                    setCompanyFormData({
                                                        name: company.name || '',
                                                        industry: company.industry || '',
                                                        size: company.size || '',
                                                        founded_year: company.founded_year || '',
                                                        website: company.website || '',
                                                        address: company.address || '',
                                                        description: company.description || ''
                                                    });
                                                }
                                            }}
                                        >
                                            Отмена
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            disabled={formLoading}
                                        >
                                            {formLoading ? <LoadingSpinner size="small" /> : 'Сохранить изменения'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                // Отображение информации о компании
                                company ? (
                                    <div className="company-info">
                                        <div className="company-description">
                                            <h3>Описание</h3>
                                            <p>{company.description || 'Описание компании отсутствует'}</p>
                                        </div>
                                        <div className="company-details">
                                            <div className="company-detail-item">
                                                <span className="detail-label">Название:</span>
                                                <span className="detail-value">{company.name}</span>
                                            </div>
                                            {company.industry && (
                                                <div className="company-detail-item">
                                                    <span className="detail-label">Отрасль:</span>
                                                    <span className="detail-value">{company.industry}</span>
                                                </div>
                                            )}
                                            {company.founded_year && (
                                                <div className="company-detail-item">
                                                    <span className="detail-label">Год основания:</span>
                                                    <span className="detail-value">{company.founded_year}</span>
                                                </div>
                                            )}
                                            {company.size && (
                                                <div className="company-detail-item">
                                                    <span className="detail-label">Размер компании:</span>
                                                    <span className="detail-value">{company.size}</span>
                                                </div>
                                            )}
                                            <div className="company-detail-item">
                                                <span className="detail-label">Вебсайт:</span>
                                                <span className="detail-value">
                                                    {company.website ? (
                                                        <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a>
                                                    ) : 'Не указан'}
                                                </span>
                                            </div>
                                            <div className="company-detail-item">
                                                <span className="detail-label">Адрес:</span>
                                                <span className="detail-value">{company.address || 'Не указан'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Если компания не создана
                                    <div className="company-empty">
                                        <p>Информация о компании отсутствует</p>
                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => setEditCompanyMode(true)}
                                        >
                                            Добавить информацию о компании
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {activeTab === 'vacancies' && (
                        <div className="profile-section">
                            <div className="section-header">
                                <h2>Вакансии компании</h2>
                                <Link to="/vacancies/create" className="btn btn-primary">
                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                    </svg>
                                    Создать вакансию
                                </Link>
                            </div>
                            
                            {vacancies.length > 0 ? (
                                <div className="vacancy-list">
                                    {vacancies.map((vacancy) => (
                                        <div key={vacancy.id} className="vacancy-card">
                                            <div className="vacancy-header">
                                                <h3>{vacancy.title}</h3>
                                                <span className={`vacancy-status ${vacancy.is_active ? 'active' : 'inactive'}`}>
                                                    {vacancy.is_active ? 'Активна' : 'Не активна'}
                                                </span>
                                            </div>
                                            <div className="vacancy-details">
                                                <div className="vacancy-detail">
                                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                                        <path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                                                    </svg>
                                                    {vacancy.salary_min && vacancy.salary_max ? 
                                                        `${vacancy.salary_min} - ${vacancy.salary_max} ₸` : 
                                                        'Зарплата не указана'}
                                                </div>
                                                <div className="vacancy-detail">
                                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                                        <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                                    </svg>
                                                    {vacancy.location || 'Местоположение не указано'}
                                                </div>
                                                <div className="vacancy-detail">
                                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                                        <path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
                                                    </svg>
                                                    {vacancy.employment_type || 'Тип занятости не указан'}
                                                </div>
                                                <div className="vacancy-detail">
                                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                                        <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                                                    </svg>
                                                    {new Date(vacancy.created_at).toLocaleDateString('ru-RU')}
                                                </div>
                                            </div>
                                            <p className="vacancy-description">{vacancy.description.substring(0, 200)}...</p>
                                            <div className="vacancy-actions">
                                                <Link to={`/vacancies/${vacancy.id}`} className="btn btn-outline">
                                                    Просмотреть
                                                </Link>
                                                <Link to={`/vacancies/edit/${vacancy.id}`} className="btn btn-outline">
                                                    Редактировать
                                                </Link>
                                                <button 
                                                    className={`btn ${vacancy.is_active ? 'btn-danger' : 'btn-success'}`}
                                                    onClick={() => toggleVacancyStatus(vacancy.id, vacancy.is_active)}
                                                >
                                                    {vacancy.is_active ? 'Деактивировать' : 'Активировать'}
                                                </button>
                                            </div>
                                            <div className="vacancy-stats">
                                                <div className="stat-item">
                                                    <span className="stat-value">{vacancy.views || 0}</span>
                                                    <span className="stat-label">Просмотров</span>
                                                </div>
                                                <div className="stat-item">
                                                    <span className="stat-value">{vacancy.responses_count || 0}</span>
                                                    <span className="stat-label">Откликов</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="vacancies-empty">
                                    <p>У вас еще нет созданных вакансий</p>
                                    <Link to="/vacancies/create" className="btn btn-primary">Создать первую вакансию</Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'responses' && (
                        <div className="profile-section">
                            <h2>Отклики на вакансии</h2>
                            <div className="responses-empty">
                                <p>У вас пока нет откликов на вакансии</p>
                                <Link to="/vacancies/create" className="btn btn-primary">Создать вакансию для получения откликов</Link>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="profile-section settings-section">
                            <h2>Настройки аккаунта</h2>
                            
                            <ChangePasswordForm />
                            
                            <div className="settings-group">
                                <h3>Персональные данные</h3>
                                {editMode ? (
                                    // Форма редактирования
                                    <form className="settings-form" onSubmit={handlePersonalFormSubmit}>
                                        {formSuccess && (
                                            <div className="success-message">
                                                {formSuccess}
                                            </div>
                                        )}
                                        
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="first_name">Имя</label>
                                                <input 
                                                    type="text" 
                                                    id="first_name" 
                                                    className="form-input" 
                                                    value={formData.first_name}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="last_name">Фамилия</label>
                                                <input 
                                                    type="text" 
                                                    id="last_name" 
                                                    className="form-input" 
                                                    value={formData.last_name}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <input 
                                                    type="email" 
                                                    id="email" 
                                                    className="form-input" 
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phone">Телефон</label>
                                                <input 
                                                    type="tel" 
                                                    id="phone" 
                                                    className="form-input" 
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="form-actions">
                                            <button 
                                                type="button" 
                                                className="btn btn-secondary" 
                                                onClick={() => {
                                                    setEditMode(false);
                                                    setFormSuccess('');
                                                    // Восстанавливаем исходные данные
                                                    if (profile && profile.user) {
                                                        setFormData({
                                                            first_name: profile.user.first_name || '',
                                                            last_name: profile.user.last_name || '',
                                                            email: profile.user.email || '',
                                                            phone: profile.user.phone || ''
                                                        });
                                                    }
                                                }}
                                            >
                                                Отмена
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary"
                                                disabled={formLoading}
                                            >
                                                {formLoading ? <LoadingSpinner size="small" /> : 'Сохранить изменения'}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    // Отображение данных
                                    <>
                                        {formSuccess && (
                                            <div className="success-message">
                                                {formSuccess}
                                            </div>
                                        )}
                                        <div className="profile-data-display">
                                            <div className="form-row">
                                                <div className="data-display-group">
                                                    <span className="data-label">Имя</span>
                                                    <span className="data-value">{profile?.user?.first_name || 'Не указано'}</span>
                                                </div>
                                                <div className="data-display-group">
                                                    <span className="data-label">Фамилия</span>
                                                    <span className="data-value">{profile?.user?.last_name || 'Не указана'}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="form-row">
                                                <div className="data-display-group">
                                                    <span className="data-label">Email</span>
                                                    <span className="data-value">{profile?.user?.email || 'Не указан'}</span>
                                                </div>
                                                <div className="data-display-group">
                                                    <span className="data-label">Телефон</span>
                                                    <span className="data-value">{profile?.user?.phone || 'Не указан'}</span>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => setEditMode(true)}
                                            >
                                                Редактировать данные
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            <div className="settings-group">
                                <h3>Настройки уведомлений</h3>
                                <div className="settings-toggle-group">
                                    <div className="toggle-item">
                                        <span>Уведомления о новых откликах</span>
                                        <label className="switch">
                                            <input 
                                                type="checkbox" 
                                                checked={notificationSettings.new_responses} 
                                                onChange={() => handleNotificationChange('new_responses')}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="toggle-item">
                                        <span>Email-рассылка</span>
                                        <label className="switch">
                                            <input 
                                                type="checkbox" 
                                                checked={notificationSettings.email_notifications}
                                                onChange={() => handleNotificationChange('email_notifications')}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                                <button 
                                    className="btn btn-primary"
                                    onClick={handleSaveNotificationSettings}
                                    disabled={formLoading}
                                >
                                    {formLoading ? <LoadingSpinner size="small" /> : 'Сохранить настройки'}
                                </button>
                            </div>
                            
                            <div className="settings-group danger-zone">
                                <h3>Опасная зона</h3>
                                <p className="danger-warning">
                                    Удаление аккаунта приведет к необратимому удалению всех ваших данных, включая профиль компании, вакансии и историю откликов.
                                </p>
                                <button 
                                    className="btn btn-danger"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    Удалить аккаунт
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
            
            {/* Модальное окно подтверждения удаления аккаунта */}
            {showDeleteModal && (
                <ConfirmModal
                    title="Удаление аккаунта"
                    message="Вы уверены, что хотите удалить свой аккаунт? Это действие невозможно отменить, и все ваши данные будут удалены безвозвратно."
                    confirmText="Удалить аккаунт"
                    cancelText="Отмена"
                    onConfirm={handleDeleteAccount}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
}

export default EmployerProfilePage;