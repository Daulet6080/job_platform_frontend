import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import CityDropdown from './CityDropdown';
import LanguageDropdown from './LanguageDropdown';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const [currentTime, setCurrentTime] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, logoutUser } = useContext(AuthContext);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const timerId = setInterval(updateTime, 60000); // Обновляем каждую минуту

    return () => clearInterval(timerId);
  }, []);

  // Обработчик для закрытия выпадающего меню при клике вне его
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Функция для обработки выхода из системы
  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    }
  };

  // Исправленная функция для перехода в профиль
  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    // Определяем правильный путь в зависимости от роли пользователя
    if (currentUser && currentUser.role) {
      const profilePath = currentUser.role === 'employer' ? '/profile/employer' : '/profile/jobseeker';
      console.log('Переход на страницу профиля:', profilePath);
      navigate(profilePath);
    } else {
      console.error('Не удалось определить роль пользователя');
      navigate('/'); // Перенаправляем на главную, если роль не определена
    }
  };

  // Функция для перехода в панель управления
  const handleDashboardClick = () => {
    setIsDropdownOpen(false);
    if (currentUser && currentUser.role) {
      const dashboardPath = currentUser.role === 'employer' ? '/employer/dashboard' : '/jobseeker/dashboard';
      navigate(dashboardPath);
    } else {
      console.error('Не удалось определить роль пользователя');
      navigate('/');
    }
  };

  // Переключение состояния выпадающего меню
  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };
  
  return (
    <header className="header">
      <div className="container header-container">
        <div className="header-left">
          <div className="header-item">
            <CityDropdown />
          </div>
          <div className="header-separator" />
          <div className="header-item">
            <LanguageDropdown />
          </div>
          <div className="header-separator" />
          <a href="tel:11343" className="header-contact" aria-label="Позвонить в поддержку">
            <svg className="header-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            <span>11 343</span>
          </a>
        </div>
        
        <div className="header-right">
          <div className="header-time">
            <svg className="header-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
              <path fill="currentColor" d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
            <span>{currentTime}</span>
          </div>
          <div className="header-separator" />
          
          {currentUser ? (
            <div className="header-user-menu" ref={dropdownRef}>
              <div 
                className={`header-username ${isDropdownOpen ? 'active' : ''}`}
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <svg className="header-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span>{currentUser.username || currentUser.email}</span>
                <svg className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
              {isDropdownOpen && (
                <div className="header-dropdown" role="menu">
                  {currentUser.role === 'employer' ? (
                    <button onClick={handleDashboardClick} className="dropdown-item" role="menuitem">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                      </svg>
                      Панель управления
                    </button>
                  ) : (
                    <button onClick={handleDashboardClick} className="dropdown-item" role="menuitem">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                      </svg>
                      Личный кабинет
                    </button>
                  )}
                  {currentUser.role === 'employer' ? (
                    <button onClick={handleProfileClick} className="dropdown-item" role="menuitem">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                      </svg>
                      Профиль компании
                    </button>
                  ) : (
                    <button onClick={handleProfileClick} className="dropdown-item" role="menuitem">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      Мой профиль
                    </button>
                  )}
                  {currentUser.role === 'employer' && (
                    <Link to="/vacancies/create" className="dropdown-item" role="menuitem">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                      Создать вакансию
                    </Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item logout-btn" role="menuitem">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="header-login">
              <svg className="header-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span>Войти</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}