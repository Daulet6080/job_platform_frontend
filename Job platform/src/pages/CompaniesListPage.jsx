import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import CompanyCard from '../components/CompanyCard';
import { companiesService } from '../services/companiesService';
import '../styles/CompaniesListPage.css';

const CompaniesListPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Состояния для фильтрации и сортировки
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [industry, setIndustry] = useState(searchParams.get('industry') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  
  // Список доступных отраслей для фильтра
  const [industries, setIndustries] = useState([]);

  // Загрузка списка компаний с учетом фильтров
  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Подготовка параметров запроса
      const params = {};
      
      if (searchQuery) params.search = searchQuery;
      if (industry) params.industry = industry;
      if (sortBy) params.ordering = sortBy;
      
      // Обновление URL с учетом фильтров
      setSearchParams(params);
      
      // Запрос данных
      const data = await companiesService.getCompanies(params);
      setCompanies(Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []));
      
      // Собираем уникальные отрасли из полученных данных
      if (Array.isArray(data.results) || Array.isArray(data)) {
        const companiesList = data.results || data;
        const uniqueIndustries = [...new Set(companiesList
          .filter(company => company.industry)
          .map(company => company.industry))]
          .sort();
        
        setIndustries(uniqueIndustries);
      }
    } catch (err) {
      console.error("Ошибка при загрузке списка компаний:", err);
      setError("Не удалось загрузить список компаний. Пожалуйста, попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  // Загружаем компании при первом рендере и при изменении фильтров
  useEffect(() => {
    loadCompanies();
  }, [sortBy]);

  // Обработчики изменения фильтров
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCompanies();
  };

  const handleIndustryChange = (e) => {
    setIndustry(e.target.value);
    setSortBy(sortBy); // Сохраняем текущую сортировку
    loadCompanies();
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setIndustry('');
    setSortBy('name');
    setSearchParams({});
    loadCompanies();
  };

  return (
    <div className="companies-list-page">
      <Header />
      <NavigationBar />
      
      <div className="companies-container">
        <div className="companies-header">
          <h1>Компании</h1>
          <p>Найдите компании и их актуальные вакансии</p>
        </div>
        
        <div className="companies-filters">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию компании..."
              className="search-input"
            />
            <button type="submit" className="search-button">Найти</button>
          </form>
          
          <div className="filter-group">
            <label htmlFor="industry-filter">Отрасль:</label>
            <select 
              id="industry-filter" 
              value={industry} 
              onChange={handleIndustryChange}
              className="filter-select"
            >
              <option value="">Все отрасли</option>
              {industries.map((ind, index) => (
                <option key={index} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sort-by">Сортировать по:</label>
            <select 
              id="sort-by" 
              value={sortBy} 
              onChange={handleSortChange}
              className="filter-select"
            >
              <option value="name">Названию (А-Я)</option>
              <option value="-name">Названию (Я-А)</option>
              <option value="-active_vacancies_count">Количеству вакансий</option>
              <option value="founded_year">Году основания (старые)</option>
              <option value="-founded_year">Году основания (новые)</option>
            </select>
          </div>
          
          {(searchQuery || industry || sortBy !== 'name') && (
            <button 
              onClick={handleClearFilters} 
              className="clear-filters-button"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Загрузка компаний...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={loadCompanies} className="retry-button">
              Повторить попытку
            </button>
          </div>
        ) : companies.length === 0 ? (
          <div className="no-results-container">
            <h3>Компании не найдены</h3>
            <p>Попробуйте изменить параметры поиска или сбросьте фильтры.</p>
            <button onClick={handleClearFilters} className="clear-filters-button">
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="companies-grid">
            {companies.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CompaniesListPage;