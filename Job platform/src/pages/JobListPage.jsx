import React, { useState, useEffect } from 'react';
import { useJobs } from '../context/JobsContext';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import Pagination from '../components/Pagination';
import '../styles/JobListPage.css';

function JobListPage() {
  const { 
    jobs, 
    loading, 
    error, 
    totalJobs, 
    currentPage, 
    setCurrentPage,
    filters,
    updateFilters,
    clearFilters,
    fetchJobs
  } = useJobs();

  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    console.log('JobListPage рендер:', {
      jobsCount: jobs?.length || 0,
      loading,
      error,
      filters
    });
  }, [jobs, loading, error, filters]);

  const handleFilterChange = (name, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    console.log('Применяем фильтры:', activeFilters);
    updateFilters(activeFilters);
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
  };

  const resetFilters = () => {
    console.log('Сбрасываем фильтры');
    setActiveFilters({});
    clearFilters();
  };

  const handlePageChange = (newPage) => {
    console.log('Переход на страницу:', newPage);
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleRefresh = () => {
    console.log('Обновляем данные');
    fetchJobs(currentPage);
  };

  return (
    <div className="job-list-page">
      <Header />
      <NavigationBar />
      
      <div className="jobs-container">
        <div className="jobs-header">
          <h1>Поиск вакансий</h1>
          <div className="jobs-stats">
            {!loading && <p>Найдено {totalJobs} вакансий</p>}
            <button onClick={handleRefresh} className="refresh-btn">
              Обновить
            </button>
          </div>
          
          <button 
            className="toggle-filters-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
          </button>
        </div>
        
        <div className="jobs-content">
          <div className={`filters-sidebar ${showFilters ? 'show-filters' : ''}`}>
            <div className="filters-header">
              <h2>Фильтры</h2>
              {showFilters && (
                <button 
                  className="close-filters-btn"
                  onClick={() => setShowFilters(false)}
                >
                  ×
                </button>
              )}
            </div>
            
            <JobFilters 
              filters={activeFilters}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
              onApplyFilters={applyFilters}
            />
          </div>
          
          <div className="jobs-list-container">
            {loading ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>Загрузка вакансий...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={() => fetchJobs(currentPage)}>Повторить попытку</button>
              </div>
            ) : jobs?.length === 0 ? (
              <div className="no-jobs-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
                  <path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                </svg>
                <p>По вашему запросу вакансий не найдено</p>
                <p>Попробуйте изменить параметры поиска</p>
                <button onClick={resetFilters} className="reset-search-btn">Сбросить фильтры</button>
              </div>
            ) : (
              <>
                {/* Отладочная информация */}
                <div className="debug-info">
                  <p>Количество вакансий: {jobs?.length || 0}</p>
                  <p>Общее количество: {totalJobs}</p>
                  <p>Текущая страница: {currentPage}</p>
                </div>
                
                <div className="jobs-list">
                  {Array.isArray(jobs) && jobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                
                {totalJobs > 10 && (
                  <Pagination 
                    currentPage={currentPage}
                    totalItems={totalJobs}
                    itemsPerPage={10}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default JobListPage;