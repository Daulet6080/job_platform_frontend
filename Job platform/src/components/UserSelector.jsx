import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/UserSelector.css';

const UserSelector = ({ onSelect, onCancel, currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Загрузка списка пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Запрашиваем список пользователей с сервера
        const response = await axios.get('/api/users/');
        const data = response.data.results || response.data;
        
        // Фильтруем, исключая текущего пользователя
        const filteredData = data.filter(user => user.id !== currentUserId);
        
        setUsers(filteredData);
        setFilteredUsers(filteredData);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке пользователей:', err);
        setError('Не удалось загрузить список пользователей');
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [currentUserId]);

  // Фильтрация пользователей по поисковому запросу
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(term) ||
        (user.first_name && user.first_name.toLowerCase().includes(term)) ||
        (user.last_name && user.last_name.toLowerCase().includes(term)) ||
        (user.email && user.email.toLowerCase().includes(term))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleConfirmSelection = () => {
    if (selectedUser && typeof onSelect === 'function') {
      onSelect(selectedUser);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="user-selector-container">
      <div className="user-selector-header">
        <h2>Выберите пользователя для беседы</h2>
        <button className="close-button" onClick={onCancel}>&times;</button>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск пользователей..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      
      {loading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Загрузка списка пользователей...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Повторить</button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="no-users-message">
          <p>Пользователи не найдены</p>
        </div>
      ) : (
        <div className="users-list">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
              onClick={() => handleUserSelect(user)}
            >
              <div className="user-avatar">
                {user.profile_image ? (
                  <img src={user.profile_image} alt={`${user.username} avatar`} />
                ) : (
                  <div className="default-avatar">
                    {(user.first_name?.charAt(0) || user.username.charAt(0)).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user.username}
                </span>
                {user.email && <span className="user-email">{user.email}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="user-selector-footer">
        <button onClick={onCancel} className="cancel-button">Отмена</button>
        <button
          onClick={handleConfirmSelection}
          className="select-button"
          disabled={!selectedUser}
        >
          Выбрать
        </button>
      </div>
    </div>
  );
};

export default UserSelector;