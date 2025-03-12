import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import CityDropdown from './CityDropdown';
import LanguageDropdown from './LanguageDropdown';

export default function Header() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Функция для обновления времени
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      setCurrentTime(formattedTime);
    };

    // Обновляем время каждую минуту
    updateTime();
    const intervalId = setInterval(updateTime, 30000); // 60 секунд

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header>
      <div className='headcontent'>
        <div className='hel'>
          <div className="locity">
            <CityDropdown/>
          </div>
        </div>
        <div className='hel'>
          <LanguageDropdown />
        </div>
        <div className='hel'>
          <a href='#' className='contact'>
            <img className='call' src='/call.png' alt='Call Icon'></img>
            <p>11 343</p>
          </a>
        </div>
      </div>
      {/* Отображение текущего времени */}
      <div className="current-time">
        <p>Текущее время: {currentTime}</p>
      </div>
      <a href='login' className='voiti'>
        <img className='user' src='/user.png' alt='User Icon'></img>
        <p>Войти</p>
      </a>
    </header>
  );
}
