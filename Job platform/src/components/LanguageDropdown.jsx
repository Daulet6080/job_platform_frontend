import { useState } from "react";
import '../styles/LanguageDropdown.css';

export default function LanguageDropdown(){
    const languages = ['Казахский', 'Русский'];

    const [selectedLanguage, setSelectedLanguage] = useState(
        localStorage.getItem('language') || 'Русский'
    );

    const [isOpen, setIsOpen] = useState(false);
    
    const handleLanguageSelect = (language)=> {
        setSelectedLanguage(language);
        localStorage.setItem('language', language);
        setIsOpen(false);
    }

    return(
        <div className="language-dropdown">
            <button className="language-button" onClick={() => setIsOpen(!isOpen)}>
                {selectedLanguage}&#9660;
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    {languages.map((language, index) => (
                        <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleLanguageSelect(language)}
                        >
                            {language}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}