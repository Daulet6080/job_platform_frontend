import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CompanyCard.css';

const DEFAULT_LOGO = '/assets/images/default-company.png';

const CompanyCard = ({ company }) => {
  const {
    id,
    name,
    logo,
    industry,
    active_vacancies_count,
    description
  } = company;

  const handleImageError = (e) => {
    e.target.src = DEFAULT_LOGO;
  };

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="company-card">
      <div className="company-card-logo">
        <img 
          src={logo || DEFAULT_LOGO} 
          alt={`${name} logo`} 
          onError={handleImageError}
        />
      </div>
      
      <div className="company-card-content">
        <h3 className="company-card-title">{name}</h3>
        
        {industry && (
          <div className="company-card-industry">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
            </svg>
            <span>{industry}</span>
          </div>
        )}
        
        <p className="company-card-description">{truncateDescription(description)}</p>
        
        <div className="company-card-footer">
          <div className="company-vacancies-count">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
            </svg>
            <span>{active_vacancies_count} вакансий</span>
          </div>
          
          <Link to={`/companies/${id}`} className="company-card-link">
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;