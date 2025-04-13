import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import CityDropdown from './CityDropdown';
import LanguageDropdown from './LanguageDropdown';

export default function Header() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 30000);

    return () => clearInterval(intervalId);
  }, []);

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
          <Link to="/login" className="header-login">
            <svg className="header-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span>Войти</span>
          </Link>
        </div>
      </div>
    </header>
  );
}