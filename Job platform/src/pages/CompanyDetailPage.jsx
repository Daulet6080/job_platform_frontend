import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import { companiesService } from '../services/companiesService';
import '../styles/CompanyDetailPage.css';

// Дефолтное лого компании
const DEFAULT_LOGO = '/assets/images/default-company.png';

const CompanyDetailPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vacanciesLoading, setVacanciesLoading] = useState(true);
  const [vacanciesError, setVacanciesError] = useState(null);
  const [totalVacancies, setTotalVacancies] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const vacanciesPerPage = 5;

  // Загрузка информации о компании
  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await companiesService.getCompanyById(id);
        if (data) {
          setCompany(data);
        } else {
          setError('Компания не найдена');
        }
      } catch (err) {
        console.error('Ошибка при загрузке информации о компании:', err);
        setError('Не удалось загрузить информацию о компании');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanyData();
  }, [id]);

  // Загрузка вакансий компании
  useEffect(() => {
    if (!company) return;
    
    const fetchCompanyVacancies = async () => {
      setVacanciesLoading(true);
      setVacanciesError(null);
      
      try {
        const params = {
          page: currentPage,
          page_size: vacanciesPerPage
        };
        
        const data = await companiesService.getCompanyVacancies(id, params);
        setVacancies(data.results);
        setTotalVacancies(data.count);
      } catch (err) {
        console.error('Ошибка при загрузке вакансий компании:', err);
        setVacanciesError('Не удалось загрузить вакансии');
      } finally {
        setVacanciesLoading(false);
      }
    };
    
    fetchCompanyVacancies();
  }, [id, company, currentPage]);

  // Обработчик изменения страницы пагинации
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: document.querySelector('.company-vacancies').offsetTop - 100, behavior: 'smooth' });
  };

  // Обработчик ошибки загрузки изображения
  const handleImageError = (e) => {
    e.target.src = DEFAULT_LOGO;
  };

  if (loading) {
    return (
      <div className="company-detail-page">
        <Header />
        <NavigationBar />
        <div className="company-loading">
          <div className="spinner"></div>
          <p>Загрузка информации о компании...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="company-detail-page">
        <Header />
        <NavigationBar />
        <div className="company-error">
          <h2>Ошибка</h2>
          <p>{error || 'Не удалось загрузить информацию о компании'}</p>
          <Link to="/companies" className="back-to-companies">
            Вернуться к списку компаний
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Формирование основного контента страницы
  return (
    <div className="company-detail-page">
      <Header />
      <NavigationBar />
      
      <div className="company-detail-container">
        <div className="company-header">
          <div className="company-logo">
            <img 
              src={company.logo || DEFAULT_LOGO} 
              alt={`${company.name} logo`} 
              onError={handleImageError}
            />
          </div>
          
          <div className="company-info">
            <h1>{company.name}</h1>
            
            <div className="company-meta">
              {company.industry && (
                <div className="company-meta-item">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                  </svg>
                  <span>Отрасль: {company.industry}</span>
                </div>
              )}
              
              {company.founded_year && (
                <div className="company-meta-item">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" />
                  </svg>
                  <span>Год основания: {company.founded_year}</span>
                </div>
              )}
              
              {company.active_vacancies_count > 0 && (
                <div className="company-meta-item">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                  </svg>
                  <span>Открыто вакансий: {company.active_vacancies_count}</span>
                </div>
              )}
              
              {company.website && (
                <div className="company-meta-item">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
                  </svg>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="company-website-link">
                    Посетить сайт
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="company-sections">
          {company.description && (
            <section className="company-section">
              <h2>О компании</h2>
              <p className="company-description">{company.description}</p>
            </section>
          )}
          
          <section className="company-section company-vacancies">
            <h2>Вакансии компании</h2>
            
            {vacanciesLoading ? (
              <div className="vacancies-loading">
                <div className="spinner small"></div>
                <p>Загрузка вакансий...</p>
              </div>
            ) : vacanciesError ? (
              <div className="vacancies-error">
                <p>{vacanciesError}</p>
                <button 
                  onClick={() => setCurrentPage(1)} 
                  className="retry-button"
                >
                  Повторить попытку
                </button>
              </div>
            ) : vacancies.length === 0 ? (
              <div className="no-vacancies">
                <p>У этой компании пока нет открытых вакансий.</p>
              </div>
            ) : (
              <>
                <div className="vacancies-list">
                  {vacancies.map(vacancy => (
                    <JobCard key={vacancy.id} job={vacancy} />
                  ))}
                </div>
                
                {/* Пагинация для вакансий */}
                {totalVacancies > vacanciesPerPage && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      &laquo; Предыдущая
                    </button>
                    
                    <span className="pagination-info">
                      Страница {currentPage} из {Math.ceil(totalVacancies / vacanciesPerPage)}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= Math.ceil(totalVacancies / vacanciesPerPage)}
                      className="pagination-button"
                    >
                      Следующая &raquo;
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CompanyDetailPage;