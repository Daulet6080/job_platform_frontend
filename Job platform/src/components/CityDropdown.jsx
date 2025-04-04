import { useState } from 'react';
import { useJobs } from '../context/JobsContext';

import '../styles/CityDropdown.css';

export default function CityDropdown() {
  const cities = ['Алматы', 'Нур-Султан', 'Шымкент']; 
  const { updateSelectedCity } = useJobs();

  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem('city') || 'Алматы'
  );

  const [isOpen, setIsOpen] = useState(false);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    localStorage.setItem('city', city);  
    setIsOpen(false);
    
    updateSelectedCity(city);
  };

  return (
    <div className="city-dropdown">
      <button className="city-button" onClick={() => setIsOpen(!isOpen)}>
        {selectedCity}&#9660;  {}
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