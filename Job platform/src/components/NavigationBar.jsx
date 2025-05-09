import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/NavigationBar.css';
import { AuthContext } from '../context/AuthContext';

export default function NavigationBar({ onSearch }) {
  const [searchText, setSearchText] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  // Определяем, активна ли текущая ссылка
  const isActive = useCallback((path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    if (searchText.trim() !== '') {
      onSearch?.(searchText);
      navigate(`/jobs?search=${encodeURIComponent(searchText.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <div className="logo" onClick={handleLogoClick}>
          <div className="logo-mark">JP</div>
          <div className="logo-text">
            <span>JobPlatform</span>
            <span className="logo-subtitle">Поиск вакансий</span>
          </div>
        </div>

        <div className="search-container">
          <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            placeholder="Поиск вакансий по названию или компании..."
            className="search-input"
            value={searchText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            aria-label="Поиск вакансий"
          />
          <button className="search-button" onClick={handleSearch}>
            Найти
          </button>
        </div>

        <div className="nav-actions">
          <Link to="/jobs" className={`nav-action ${isActive('/jobs') ? 'active' : ''}`}>
            <svg className="nav-icon" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
            </svg>
            <span>Вакансии</span>
          </Link>
          <Link to="/companies" className={`nav-action ${isActive('/companies') ? 'active' : ''}`}>
            <svg className="nav-icon" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
            </svg>
            <span>Компании</span>
          </Link>
          <Link to="/favorites" className={`nav-action ${isActive('/favorites') ? 'active' : ''}`}>
            <svg className="nav-icon" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>Избранное</span>
          </Link>
          {currentUser && (
            <Link to="/chat" className={`nav-action ${isActive('/chat') ? 'active' : ''}`}>
              <svg className="nav-icon" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
              <span>Сообщения</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}