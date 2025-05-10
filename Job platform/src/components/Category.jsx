import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Category.css';
import withRenderLogging from './withRenderLogging';

// Импорт изображений для категорий
import frontendImg from '../assets/images/frontend.jpg';
import backendImg from '../assets/images/backend.jpg';
import designImg from '../assets/images/design.png';
import qaImg from '../assets/images/qa.jpg';
import devopsImg from '../assets/images/devops.jpg';
import dataAnalyticsImg from '../assets/images/data_analytics.png';
import cybersecurityImg from '../assets/images/cybersecurity.jpg';
import pmImg from '../assets/images/pm.png';
import supportImg from '../assets/images/support.jpg';
import cloudImg from '../assets/images/cloud.jpg';

// Карта соответствия категорий и изображений
const categoryImages = {
  'Frontend': frontendImg,
  'Backend': backendImg,
  'UX/UI': designImg,
  'Тестирование': qaImg,
  'DevOps': devopsImg,
  'Аналитика данных': dataAnalyticsImg,
  'Кибербезопасность': cybersecurityImg,
  'Проектный менеджмент': pmImg,
  'Техническая поддержка': supportImg,
  'Облачные технологии': cloudImg,
};

// Моковые данные для тестирования, если API недоступен
const MOCK_CATEGORIES = [
  { id: 1, name: 'Frontend', vacancies_count: 12 },
  { id: 2, name: 'Backend', vacancies_count: 8 },
  { id: 3, name: 'DevOps', vacancies_count: 5 },
  { id: 4, name: 'UX/UI дизайн', vacancies_count: 3 },
  { id: 5, name: 'Тестирование', vacancies_count: 7 },
  { id: 6, name: 'Мобильная разработка', vacancies_count: 4 },
  { id: 7, name: 'Аналитика данных', vacancies_count: 6 },
  { id: 8, name: 'Проектный менеджмент', vacancies_count: 3 },
  { id: 9, name: 'Кибербезопасность', vacancies_count: 2 },
];

// Функция для получения изображения по имени категории
const getCategoryImage = (categoryName) => {
  // Поиск по ключевым словам в названии
  for (const [key, img] of Object.entries(categoryImages)) {
    if (categoryName && categoryName.toLowerCase().includes(key.toLowerCase())) {
      return img;
    }
  }
  // Если не нашли совпадений, возвращаем случайное изображение
  const images = Object.values(categoryImages);
  return images[Math.floor(Math.random() * images.length)];
};

function Category() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [useMockData, setUseMockData] = useState(false);
  // Используем ref для отслеживания выполнения запроса
  const hasLoadedRef = useRef(false);

  // Загрузка категорий из API - только один раз при монтировании
  useEffect(() => {
    // Если запрос уже выполнялся, не запускаем его снова
    if (hasLoadedRef.current) return;
    
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Используем моковые данные или API
        if (useMockData) {
          console.log('Используем моковые данные для категорий');
          setCategories(MOCK_CATEGORIES);
        } else {
          try {
            const response = await axios.get('/api/companies/categories/');
            console.log('Запрос категорий выполнен');
            
            if (response.data && Array.isArray(response.data)) {
              setCategories(response.data);
            } else if (response.data && Array.isArray(response.data.results)) {
              setCategories(response.data.results);
            } else {
              console.warn('API вернул неожиданный формат данных');
              setUseMockData(true); // Переключаемся на моковые данные
              return; // Выход из функции, useEffect запустится повторно из-за изменения useMockData
            }
          } catch (err) {
            console.error("Ошибка при загрузке категорий:", err);
            setError("Не удалось загрузить категории вакансий");
            setUseMockData(true); // Переключаемся на моковые данные
            return; // Выход из функции, useEffect запустится повторно из-за изменения useMockData
          }
        }
      } finally {
        setLoading(false);
        // Отмечаем, что загрузка была выполнена
        hasLoadedRef.current = true;
      }
    };

    fetchCategories();
  }, [useMockData]);

  // Предварительная загрузка изображений после получения категорий
  useEffect(() => {
    if (!Array.isArray(categories) || categories.length === 0) return;
    
    const preloadImages = () => {
      categories.forEach(category => {
        if (!category || !category.name) return;
        
        const imageUrl = getCategoryImage(category.name);
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          setLoadedImages(prev => ({
            ...prev,
            [category.id]: true
          }));
        };
      });
    };
    
    preloadImages();
  }, [categories]);

  const handleCategoryClick = (categoryId) => {
    // Переход на страницу с вакансиями с применением фильтра по категории
    navigate(`/jobs?category=${categoryId}`);
  };

  // Показываем загрузчик, пока данные не получены
  if (loading && !hasLoadedRef.current) {
    return (
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Категории вакансий</h2>
          <div className="categories-loading">Загрузка категорий...</div>
        </div>
      </section>
    );
  }

  // Показываем сообщение об ошибке, если не удалось загрузить данные
  if (error && !useMockData) {
    return (
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Категории вакансий</h2>
          <div className="categories-error">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="categories-section">
      <div className="container">
        <h2 className="section-title">
          Категории вакансий
          {useMockData && process.env.NODE_ENV !== 'production' && (
            <span className="mock-data-badge">Демо-данные</span>
          )}
        </h2>
        
        <div className="categories-grid">
          {/* Добавляем проверку, что categories - это массив */}
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map(category => (
              <div 
                key={category.id} 
                className="category-card"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="category-image-wrapper">
                  <img 
                    src={getCategoryImage(category.name)} 
                    alt={category.name} 
                    className="category-image"
                    style={{ opacity: loadedImages[category.id] ? 1 : 0.3 }}
                  />
                  <div className="category-image-overlay"></div>
                </div>
                <h3 className="category-name">{category.name}</h3>
                <div className="category-job-count">
                  {category.vacancies_count || 0} {getVacancyCountText(category.vacancies_count || 0)}
                </div>
              </div>
            ))
          ) : (
            <div className="no-categories-message">
              Категории пока не добавлены
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Функция для правильного склонения слова "вакансия"
function getVacancyCountText(count) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return 'вакансия';
  } else if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
    return 'вакансии';
  } else {
    return 'вакансий';
  }
}

export default withRenderLogging(Category);