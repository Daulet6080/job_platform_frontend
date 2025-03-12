import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NavigationBar.css';

export default function NavigationBar({ onSearch }) { // Получаем onSearch как пропс
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchText); // Вызываем переданную функцию с текстом поиска
  };

  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleCartClick = () => {
    navigate('/cart'); // Переход в корзину
  };

  return (
    <nav className="navigation-bar">
      <div className="logo" onClick={handleLogoClick}>
        <img src="/logo.jpeg" alt="Логотип" />
      </div>

      <div className="search-container">
        <img className="search" src="/search.png" alt="Поиск" />
        <input
          type="text"
          placeholder="Поиск товаров..."
          className="search-input"
          value={searchText}
          onChange={handleInputChange}
        />
        <button className="search-button" onClick={handleSearch}>
          Найти
        </button>
      </div>

      <div className="nav-icons">
        <div className="icon fav-icon">
          <img src="/isb.png" alt="Избранное" />
          <p>Избранное</p>
        </div>
        <div className="icon cart-icon" onClick={handleCartClick}>
          <img src="/corsina.png" alt="Корзина" />
          <p>Корзина</p>
        </div>
      </div>
    </nav>
  );
}

