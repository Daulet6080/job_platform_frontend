import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/JobCard.css';

function JobCard({ job }) {
  if (!job || typeof job !== 'object') {
    console.error('Неверный формат данных вакансии:', job);
    return null;
  }

  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const jobExists = savedJobs.some(savedJob => savedJob.id === job.id);
    setIsSaved(jobExists);
  }, [job.id]);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Дата не указана";
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ru-RU', { 
        day: 'numeric',
        month: 'long'
      }).format(date);
    } catch (e) {
      console.error('Ошибка форматирования даты:', e);
      return dateString || "Дата не указана";
    }
  };

  const handleSaveJob = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    
    const jobExists = savedJobs.some(savedJob => savedJob.id === job.id);
    
    if (!jobExists) {
      savedJobs.push(job);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      setIsSaved(true);
    } else {
      const updatedJobs = savedJobs.filter(savedJob => savedJob.id !== job.id);
      localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
      setIsSaved(false);
    }
  };

  const title = job.title || "Название не указано";
  const companyName = job.company?.name || "Компания не указана";
  const location = job.location || "Не указано";
  const description = job.description || "";
  const publishedAt = job.published_at || null;
  const salaryFrom = job.salary_from;
  const salaryTo = job.salary_to;

  return (
    <Link to={`/jobs/${job.id}`} className="job-card">
      <div className="job-card-header">
        <h2 className="job-title">{title}</h2>
        <button 
          className={`save-job-btn ${isSaved ? 'saved' : ''}`} 
          onClick={handleSaveJob}
          aria-label={isSaved ? "Удалить из избранного" : "Добавить в избранное"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill={isSaved ? "#ff6b6b" : "currentColor"} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>
      
      <div className="job-company">{companyName}</div>
      
      <div className="job-details">
        <div className="job-location">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span>{location}</span>
        </div>
        
        {(salaryFrom || salaryTo) && (
          <div className="job-salary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
            </svg>
            <span>
              {salaryFrom && salaryTo 
                ? `${salaryFrom} - ${salaryTo} ₸` 
                : salaryFrom 
                  ? `от ${salaryFrom} ₸` 
                  : salaryTo 
                    ? `до ${salaryTo} ₸` 
                    : "Не указано"}
            </span>
          </div>
        )}
        
        {publishedAt && (
          <div className="job-date">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"/>
            </svg>
            <span>{formatDate(publishedAt)}</span>
          </div>
        )}
      </div>
      
      {description && (
        <div className="job-description">
          {description.length > 160 
            ? `${description.substring(0, 160)}...` 
            : description}
        </div>
      )}
      
      <div className="job-card-footer">
        <span className="view-more">Подробнее</span>
      </div>
    </Link>
  );
}

export default JobCard;