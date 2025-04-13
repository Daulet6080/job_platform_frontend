import { useState, useEffect, useRef } from "react";
import '../styles/CityDropdown.css';

export default function LanguageDropdown() {
    const languages = ['Казахский', 'Русский'];
    const dropdownRef = useRef(null);

    const [selectedLanguage, setSelectedLanguage] = useState(
        localStorage.getItem('language') || 'Русский'
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

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        localStorage.setItem('language', language);
        setIsOpen(false);
    }

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button 
                className="dropdown-button" 
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {selectedLanguage}
                <span className={`icon ${isOpen ? 'open' : ''}`}>&#9660;</span>
            </button>
            
            <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
                {languages.map((language, index) => (
                    <div
                        key={index}
                        className={`dropdown-item ${language === selectedLanguage ? 'selected' : ''}`}
                        onClick={() => handleLanguageSelect(language)}
                        role="option"
                        aria-selected={language === selectedLanguage}
                        tabIndex={0}
                    >
                        {language}
                    </div>
                ))}
            </div>
        </div>
    )
}