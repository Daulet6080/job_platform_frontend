import React, { useState, useEffect } from 'react';
import '../styles/JobFilters.css';
import { categoriesService } from '../services/categoriesService';

const jobTypes = [
  { value: 'full-time', label: 'Полная занятость' },
  { value: 'part-time', label: 'Частичная занятость' },
  { value: 'contract', label: 'Контракт' },
  { value: 'internship', label: 'Стажировка' },
  { value: 'freelance', label: 'Фриланс' }
];

const experienceLevels = [
  { value: 'no-experience', label: 'Без опыта' },
  { value: 'junior', label: 'Джуниор (1-2 года)' },
  { value: 'middle', label: 'Мидл (2-4 года)' },
  { value: 'senior', label: 'Сеньор (4-6 лет)' },
  { value: 'expert', label: '6+ лет опыта' }
];

const salaryRanges = [
  { value: '100000', label: 'от 100 000 ₸' },
  { value: '200000', label: 'от 200 000 ₸' },
  { value: '300000', label: 'от 300 000 ₸' },
  { value: '500000', label: 'от 500 000 ₸' },
  { value: '700000', label: 'от 700 000 ₸' },
  { value: '1000000', label: 'от 1 000 000 ₸' }
];

const locations = [
  { value: 'Алматы', label: 'Алматы' },
  { value: 'Астана', label: 'Астана' },
  { value: 'Караганда', label: 'Караганда' },
  { value: 'Шымкент', label: 'Шымкент' },
  { value: 'Атырау', label: 'Атырау' },
  { value: 'Актобе', label: 'Актобе' }
];

export default function JobFilters({ filters, onFilterChange, onResetFilters, onApplyFilters }) {
  const [collapsed, setCollapsed] = useState({
    category: false,
    jobType: false,
    experience: false,
    salary: false,
    location: false
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Получаем список категорий из API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await categoriesService.getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Ошибка при получении категорий:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleChange = (name, value) => {
    onFilterChange(name, value);
  };

  const toggleCollapse = (section) => {
    setCollapsed(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="job-filters">
      <div className="filter-header">
        <h3 className="filter-title">Фильтры поиска</h3>
        <button className="filter-reset" onClick={onResetFilters}>
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M19.77 5.03l1.4 1.4L8.43 19.17l-5.6-5.6 1.4-1.4 4.2 4.2L19.77 5.03M19.77 3l-7.94 7.94L8.43 7.53 1.83 14.13 7.4 19.7 21.23 5.9 19.77 3z"/>
          </svg>
          Сбросить
        </button>
      </div>

      <div className="filter-group">
        <div className="filter-search">
          <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            placeholder="Поиск по ключевым словам"
            className="filter-input"
            value={filters.search || ""}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-divider"></div>

      <div className="filter-group">
        <div 
          className={`filter-header-collapsible ${collapsed.category ? 'collapsed' : ''}`}
          onClick={() => toggleCollapse('category')}
        >
          <h4 className="filter-group-title">Категория</h4>
          <svg viewBox="0 0 24 24" width="18" height="18" className="dropdown-icon">
            <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </div>

        <div className={`filter-content ${collapsed.category ? 'collapsed' : ''}`}>
          <div className="filter-select">
            {loading ? (
              <div className="filter-loading">Загрузка категорий...</div>
            ) : (
              <select
                value={filters.category || ""}
                onChange={(e) => handleChange('category', e.target.value)}
                className="filter-dropdown"
              >
                <option value="">Все категории</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Оставшаяся часть кода без изменений */}
      <div className="filter-divider"></div>

      <div className="filter-group">
        <div 
          className={`filter-header-collapsible ${collapsed.jobType ? 'collapsed' : ''}`}
          onClick={() => toggleCollapse('jobType')}
        >
          <h4 className="filter-group-title">Тип работы</h4>
          <svg viewBox="0 0 24 24" width="18" height="18" className="dropdown-icon">
            <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </div>

        <div className={`filter-content ${collapsed.jobType ? 'collapsed' : ''}`}>
          <div className="filter-radio-group">
            {jobTypes.map(type => (
              <label key={type.value} className="filter-radio-label">
                <input
                  type="radio"
                  name="jobType"
                  value={type.value}
                  checked={filters.jobType === type.value}
                  onChange={(e) => handleChange('jobType', e.target.value)}
                  className="filter-radio"
                />
                <span className="filter-radio-text">{type.label}</span>
              </label>
            ))}
            <label className="filter-radio-label">
              <input
                type="radio"
                name="jobType"
                value=""
                checked={!filters.jobType}
                onChange={(e) => handleChange('jobType', '')}
                className="filter-radio"
              />
              <span className="filter-radio-text">Все типы</span>
            </label>
          </div>
        </div>
      </div>

      <div className="filter-divider"></div>

      <div className="filter-group">
        <div 
          className={`filter-header-collapsible ${collapsed.experience ? 'collapsed' : ''}`}
          onClick={() => toggleCollapse('experience')}
        >
          <h4 className="filter-group-title">Опыт работы</h4>
          <svg viewBox="0 0 24 24" width="18" height="18" className="dropdown-icon">
            <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </div>

        <div className={`filter-content ${collapsed.experience ? 'collapsed' : ''}`}>
          <div className="filter-select">
            <select
              value={filters.experience || ""}
              onChange={(e) => handleChange('experience', e.target.value)}
              className="filter-dropdown"
            >
              <option value="">Любой опыт</option>
              {experienceLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="filter-divider"></div>

      <div className="filter-group">
        <div 
          className={`filter-header-collapsible ${collapsed.salary ? 'collapsed' : ''}`}
          onClick={() => toggleCollapse('salary')}
        >
          <h4 className="filter-group-title">Зарплата</h4>
          <svg viewBox="0 0 24 24" width="18" height="18" className="dropdown-icon">
            <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </div>

        <div className={`filter-content ${collapsed.salary ? 'collapsed' : ''}`}>
          <div className="filter-select">
            <select
              value={filters.salary || ""}
              onChange={(e) => handleChange('salary', e.target.value)}
              className="filter-dropdown"
            >
              <option value="">Любая зарплата</option>
              {salaryRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="filter-divider"></div>

      <div className="filter-group">
        <div 
          className={`filter-header-collapsible ${collapsed.location ? 'collapsed' : ''}`}
          onClick={() => toggleCollapse('location')}
        >
          <h4 className="filter-group-title">Город</h4>
          <svg viewBox="0 0 24 24" width="18" height="18" className="dropdown-icon">
            <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </div>

        <div className={`filter-content ${collapsed.location ? 'collapsed' : ''}`}>
          <div className="filter-select">
            <select
              value={filters.location || ""}
              onChange={(e) => handleChange('location', e.target.value)}
              className="filter-dropdown"
            >
              <option value="">Все города</option>
              {locations.map(loc => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="filter-divider"></div>

      <div className="filter-group">
        <label className="filter-checkbox-label">
          <input
            type="checkbox"
            checked={filters.remote || false}
            onChange={(e) => handleChange('remote', e.target.checked)}
            className="filter-checkbox"
          />
          <span className="filter-checkbox-text">Удаленная работа</span>
        </label>
      </div>

      <div className="filter-actions">
        <button 
          className="apply-filters-btn"
          onClick={onApplyFilters}
        >
          Применить фильтры
        </button>
      </div>
    </div>
  );
}