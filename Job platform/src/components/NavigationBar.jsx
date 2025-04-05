import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageOutlined } from '@ant-design/icons';
import '../styles/NavigationBar.css';

// eslint-disable-next-line react/prop-types
export default function NavigationBar({ onSearch }) {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchClick = useCallback(() => {
    if (searchText.trim() !== '') {
      onSearch(searchText);
    } else {
      onSearch(''); // Передаем пустую строку для отображения всех
    }
  }, [searchText, onSearch]);

  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleCartClick = () => {
    navigate('/cart');
  };

  const goToChat = () => {
    navigate('/chat');
  };

  return (
      <nav className="navigation-bar">
        <div className="logo" onClick={handleLogoClick}>
          <img src="/logo.png" alt="Логотип" />
        </div>

        <div className="search-container">
          <img className="search" src="/search.png" alt="Поиск" />
          <input
              type="text"
              placeholder="Поиск вакансий..."
              className="search-input"
              value={searchText}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchClick();
                }
              }}
          />
          <button className="search-button" onClick={handleSearchClick}>
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
          <div className="icon chat-icon" onClick={goToChat}>
            <MessageOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
            <p>Чат</p>
          </div>
        </div>
      </nav>
  );
}