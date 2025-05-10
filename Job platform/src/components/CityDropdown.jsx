import React, { useState, useEffect, useRef } from 'react';
import { useJobs } from '../context/JobsContext';
import '../styles/CityDropdown.css';

// Список популярных городов Казахстана
const popularCities = [
  'Алматы', 'Астана', 'Шымкент', 'Караганда', 
  'Актобе', 'Тараз', 'Павлодар', 'Усть-Каменогорск',
  'Семей', 'Атырау', 'Костанай', 'Кызылорда'
];

const CityDropdown = () => {
  const { selectedCity, updateSelectedCity } = useJobs();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState(popularCities);
  const dropdownRef = useRef(null);

  // Фильтрация городов при вводе поиска
  useEffect(() => {
    if (searchTerm) {
      const filtered = popularCities.filter(city => 
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(popularCities);
    }
  }, [searchTerm]);

  // Закрытие dropdown при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Выбор города
  const handleSelectCity = (city) => {
    updateSelectedCity(city);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Очистка выбранного города
  const handleClearCity = (e) => {
    e.stopPropagation();
    updateSelectedCity('');
  };

  return (
    <div className="city-dropdown" ref={dropdownRef}>
      <div 
        className="selected-city" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="city-icon">📍</span>
        {selectedCity || 'Выберите город'}
        {selectedCity && (
          <button 
            className="clear-city"
            onClick={handleClearCity}
          >
            ×
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="city-dropdown-menu">
          <div className="city-search">
            <input 
              type="text"
              placeholder="Поиск города..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="city-list">
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <div 
                  key={index}
                  className={`city-item ${selectedCity === city ? 'selected' : ''}`}
                  onClick={() => handleSelectCity(city)}
                >
                  {city}
                </div>
              ))
            ) : (
              <div className="no-cities">Город не найден</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CityDropdown;