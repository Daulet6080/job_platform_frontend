import React, { useState, useEffect, useRef } from 'react';
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
    fetchJobs,
    categoryDetails
  } = useJobs();

  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [debugMode, setDebugMode] = useState(process.env.NODE_ENV !== 'production');
  
  // Отслеживаем был ли уже выполнен запрос с параметрами
  const initialLoadRef = useRef(false);

  // Синхронизация локальных фильтров с контекстом
  useEffect(() => {
    setActiveFilters({...filters});
  }, [filters]);

  // Проверяем параметр category в URL при монтировании
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam && categoryParam !== filters.category) {
      console.log('Применяем фильтр категории из URL:', categoryParam);
      updateFilters({ category: categoryParam });
    }
  }, [filters.category, updateFilters]);

  const handleFilterChange = (name, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    // Применяем фильтры и очищаем кеш для получения актуальных данных
    console.log('Применяем фильтры:', activeFilters);
    updateFilters(activeFilters);
    
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
  };

  const resetFilters = () => {
    setActiveFilters({});
    clearFilters();
  };

  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return;
    
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleRefresh = () => {
    // Очищаем кеш и выполняем запрос заново
    jobsService.clearCache?.();
    fetchJobs(currentPage);
  };

  const handleRemoveCategoryFilter = () => {
    const newFilters = { ...activeFilters };
    delete newFilters.category;
    
    setActiveFilters(newFilters);
    updateFilters(newFilters);
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
            
            {/* Отладочная кнопка */}
            {debugMode && (
              <button 
                onClick={() => console.log('Текущие фильтры:', filters, 'Текущие вакансии:', jobs)} 
                className="debug-btn"
                style={{marginLeft: '10px', fontSize: '12px'}}
              >
                Debug
              </button>
            )}
          </div>
          
          <button 
            className="toggle-filters-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
          </button>
          
          {/* Индикатор активной категории */}
          {filters.category && categoryDetails && (
            <div className="active-filters">
              <span className="active-filter">
                Категория: {categoryDetails.name}
                <button 
                  className="remove-filter-btn"
                  onClick={handleRemoveCategoryFilter}
                >
                  ×
                </button>
              </span>
            </div>
          )}
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
            ) : !Array.isArray(jobs) || jobs.length === 0 ? (
              <div className="no-jobs-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
                  <path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                </svg>
                <p>По вашему запросу вакансий не найдено</p>
                {categoryDetails && (
                  <p>В категории "{categoryDetails.name}" пока нет вакансий или они уже закрыты</p>
                )}
                
                {Object.keys(filters).length > 0 && (
                  <button onClick={resetFilters} className="reset-search-btn">
                    Сбросить фильтры
                  </button>
                )}
              </div>
            ) : (
              <>
                {categoryDetails && (
                  <div className="category-header">
                    <h2>Вакансии в категории "{categoryDetails.name}"</h2>
                    <p>Показано {jobs.length} из {totalJobs} вакансий</p>
                  </div>
                )}
                
                <div className="jobs-list">
                  {jobs.map(job => (
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