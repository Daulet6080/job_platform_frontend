import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsService } from '../services/jobsService';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext'; 
import '../styles/JobDetailPage.css';

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = React.useContext(AuthContext);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      setLoading(true);
      try {
        const data = await jobsService.getJobById(id);
        if (data) {
          setJob(data);
          
          const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
          const jobIsSaved = savedJobs.some(savedJob => savedJob.id === data.id);
          setIsSaved(jobIsSaved);
        } else {
          setError('Вакансия не найдена');
        }
      } catch (err) {
        console.error('Ошибка при загрузке вакансии:', err);
        setError('Не удалось загрузить данные вакансии. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Дата не указана';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ru-RU', { 
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const handleSaveJob = () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    
    if (isSaved) {
      const updatedJobs = savedJobs.filter(savedJob => savedJob.id !== job.id);
      localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
      setIsSaved(false);
    } else {
      savedJobs.push(job);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      setIsSaved(true);
    }
  };

  const handleApplyClick = () => {
    if (!currentUser) {
      navigate('/login', { state: { redirectTo: `/jobs/${id}` } });
      return;
    }
    
    setIsApplying(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (!applicationMessage.trim()) {
      setApplicationError('Пожалуйста, добавьте сопроводительное письмо');
      return;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApplicationSuccess(true);
      setApplicationError(null);
      setApplicationMessage('');
      
      setTimeout(() => {
        setIsApplying(false);
        setApplicationSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Ошибка при отправке отклика:', err);
      setApplicationError('Произошла ошибка при отправке отклика. Пожалуйста, попробуйте еще раз.');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <NavigationBar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка вакансии...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Header />
        <NavigationBar />
        <div className="error-container">
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/jobs')}>Вернуться к списку вакансий</button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="page-container">
        <Header />
        <NavigationBar />
        <div className="error-container">
          <h2>Вакансия не найдена</h2>
          <button onClick={() => navigate('/jobs')}>Вернуться к списку вакансий</button>
        </div>
        <Footer />
      </div>
    );
  }

  // Иконки для кнопок
  const heartIconFilled = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
      <path fill="#ff6b6b" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
  
  const heartIconOutline = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
      <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
  
  const applyIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
      <path fill="currentColor" d="M10 8v8l6-4-6-4zm11.008-2H3.992A1.992 1.992 0 0 0 2 7.992v8.016C2 17.11 2.89 18 3.992 18h16.016A1.992 1.992 0 0 0 22 16.008V7.992A1.992 1.992 0 0 0 21.008 6z"/>
    </svg>
  );

  return (
    <div className="page-container">
      <Header />
      <NavigationBar />
      
      <div className="job-detail-container">
        <div className="back-navigation">
          <Link to="/jobs" className="back-link">← Вернуться к списку вакансий</Link>
        </div>
        
        <div className="job-detail-header">
          <div className="job-detail-title-section">
            <h1>{job.title}</h1>
            <div className="job-company-info">
              {job.company && (
                <>
                  <div className="company-logo">
                    {job.company.logo ? (
                      <img src={job.company.logo} alt={`${job.company.name} logo`} />
                    ) : (
                      <div className="company-logo-placeholder">
                        {job.company.name?.charAt(0) || 'C'}
                      </div>
                    )}
                  </div>
                  <div className="company-details">
                    <h2>{job.company.name}</h2>
                    <Link to={`/companies/${job.company.id}`}>О компании</Link>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="job-actions">
            <button 
              className={`save-job-button ${isSaved ? 'saved' : ''}`}
              onClick={handleSaveJob}
            >
              {isSaved ? (
                <>
                  {heartIconFilled}
                  В избранном
                </>
              ) : (
                <>
                  {heartIconOutline}
                  Сохранить
                </>
              )}
            </button>
            
            <button 
              className="apply-button"
              onClick={handleApplyClick}
            >
              {applyIcon}
              Откликнуться
            </button>
          </div>
        </div>
        
        <div className="job-detail-main">
          <div className="job-detail-meta">
            <div className="meta-item">
              <span className="meta-label">Локация:</span>
              <span className="meta-value">{job.location || "Не указано"}</span>
            </div>
            
            {(job.salary_from || job.salary_to) && (
              <div className="meta-item">
                <span className="meta-label">Зарплата:</span>
                <span className="meta-value">
                  {job.salary_from && job.salary_to 
                    ? `${job.salary_from} - ${job.salary_to} ₸` 
                    : job.salary_from 
                      ? `от ${job.salary_from} ₸` 
                      : job.salary_to 
                        ? `до ${job.salary_to} ₸` 
                        : "Не указано"}
                </span>
              </div>
            )}
            
            {job.employment_type && (
              <div className="meta-item">
                <span className="meta-label">Тип работы:</span>
                <span className="meta-value">
                  {(() => {
                    switch (job.employment_type) {
                      case 'full-time': return 'Полная занятость';
                      case 'part-time': return 'Частичная занятость';
                      case 'contract': return 'Контракт';
                      case 'internship': return 'Стажировка';
                      case 'freelance': return 'Фриланс';
                      default: return job.employment_type;
                    }
                  })()}
                </span>
              </div>
            )}
            
            {job.experience && (
              <div className="meta-item">
                <span className="meta-label">Опыт:</span>
                <span className="meta-value">
                  {(() => {
                    switch (job.experience) {
                      case 'no_experience': return 'Без опыта';
                      case 'junior': return '1-3 года';
                      case 'middle': return '3-5 лет';
                      case 'senior': return '5+ лет';
                      default: return job.experience;
                    }
                  })()}
                </span>
              </div>
            )}
            
            {job.published_at && (
              <div className="meta-item">
                <span className="meta-label">Опубликовано:</span>
                <span className="meta-value">{formatDate(job.published_at)}</span>
              </div>
            )}
            
            {job.category && (
              <div className="meta-item">
                <span className="meta-label">Категория:</span>
                <span className="meta-value">{job.category.name}</span>
              </div>
            )}
            
            {job.skills && job.skills.length > 0 && (
              <div className="meta-item skills-item">
                <span className="meta-label">Навыки:</span>
                <div className="skills-list">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="job-detail-content">
            {job.description && (
              <div className="job-description">
                <h3>Описание вакансии</h3>
                <div dangerouslySetInnerHTML={{ __html: job.description }} />
              </div>
            )}
            
            {job.requirements && (
              <div className="job-requirements">
                <h3>Требования</h3>
                <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
              </div>
            )}
            
            {job.responsibilities && (
              <div className="job-responsibilities">
                <h3>Обязанности</h3>
                <div dangerouslySetInnerHTML={{ __html: job.responsibilities }} />
              </div>
            )}
            
            {job.benefits && (
              <div className="job-benefits">
                <h3>Преимущества</h3>
                <div dangerouslySetInnerHTML={{ __html: job.benefits }} />
              </div>
            )}
          </div>
        </div>
        
        <div className="job-detail-footer">
          <button 
            className="apply-button-large"
            onClick={handleApplyClick}
          >
            Откликнуться на вакансию
          </button>
        </div>
      </div>
      
      {isApplying && (
        <div className="application-modal-overlay">
          <div className="application-modal">
            <div className="application-modal-header">
              <h2>Отклик на вакансию</h2>
              <button 
                className="close-modal-btn"
                onClick={() => setIsApplying(false)}
              >
                ×
              </button>
            </div>
            
            {applicationSuccess ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Ваш отклик успешно отправлен</h3>
                <p>Работодатель получит ваше резюме и сопроводительное письмо.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="application-form">
                <div className="form-group">
                  <label htmlFor="applicationMessage">Сопроводительное письмо</label>
                  <textarea
                    id="applicationMessage"
                    rows="6"
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    placeholder="Расскажите почему вы подходите на эту должность..."
                  ></textarea>
                  {applicationError && (
                    <div className="error-feedback">{applicationError}</div>
                  )}
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setIsApplying(false)}>Отмена</button>
                  <button type="submit" className="submit-application">Отправить отклик</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default JobDetailPage;