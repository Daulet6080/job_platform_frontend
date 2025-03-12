import { useState } from 'react';
import '../styles/CityDropdown.css';  // Подключаем стили для выбора города

export default function CityDropdown() {
  const cities = ['Алматы', 'Нур-Султан', 'Шымкент']; // Массив с городами

  // Проверяем, сохранен ли город в localStorage, если нет, по умолчанию 'Алматы'
  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem('city') || 'Алматы'
  );

  const [isOpen, setIsOpen] = useState(false);

  // Функция для выбора города и закрытия меню
  const handleCitySelect = (city) => {
    setSelectedCity(city);
    localStorage.setItem('city', city);  // Сохраняем выбранный город в localStorage
    setIsOpen(false);
  };

  return (
    <div className="city-dropdown">
      <button className="city-button" onClick={() => setIsOpen(!isOpen)}>
        {selectedCity}&#9660;  {/* Отображаем выбранный город с иконкой стрелки вниз */}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {cities.map((city, index) => (
            <div 
              key={index} 
              className="dropdown-item" 
              onClick={() => handleCitySelect(city)}
            >
              {city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
