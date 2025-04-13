import { useState, useEffect, useRef } from 'react';
import { useJobs } from '../context/JobsContext';
import '../styles/CityDropdown.css';

export default function CityDropdown() {
  const cities = ['Алматы', 'Нур-Султан', 'Шымкент']; 
  const { updateSelectedCity } = useJobs();
  const dropdownRef = useRef(null);

  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem('city') || 'Алматы'
  );

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    localStorage.setItem('city', city);  
    setIsOpen(false);
    updateSelectedCity(city);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button 
        className="dropdown-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {selectedCity}
        <span className={`icon ${isOpen ? 'open' : ''}`}>&#9660;</span>
      </button>
      
      <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
        {cities.map((city, index) => (
          <div 
            key={index} 
            className={`dropdown-item ${city === selectedCity ? 'selected' : ''}`}
            onClick={() => handleCitySelect(city)}
            role="option"
            aria-selected={city === selectedCity}
            tabIndex={0}
          >
            {city}
          </div>
        ))}
      </div>
    </div>
  );
}