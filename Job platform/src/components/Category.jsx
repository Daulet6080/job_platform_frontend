import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Category.css';
import withRenderLogging from './withRenderLogging';

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

const categories = [
  { id: 1, name: 'Frontend-разработка', image: frontendImg, jobCount: 145 },
  { id: 2, name: 'Backend-разработка', image: backendImg, jobCount: 127 },
  { id: 3, name: 'Дизайн UX/UI', image: designImg, jobCount: 84 },
  { id: 4, name: 'Тестирование ПО', image: qaImg, jobCount: 63 },
  { id: 5, name: 'DevOps и инфраструктура', image: devopsImg, jobCount: 39 },
  { id: 6, name: 'Аналитика данных', image: dataAnalyticsImg, jobCount: 51 },
  { id: 7, name: 'Кибербезопасность', image: cybersecurityImg, jobCount: 27 },
  { id: 8, name: 'Проектный менеджмент', image: pmImg, jobCount: 42 },
  { id: 9, name: 'Техническая поддержка', image: supportImg, jobCount: 58 },
  { id: 10, name: 'Облачные технологии', image: cloudImg, jobCount: 35 }
];

function Category() {
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState({});

  const handleCategoryClick = (categoryId) => {
    navigate(`/jobs?category=${categoryId}`);
  };
  
  useEffect(() => {
    categories.forEach(category => {
      const img = new Image();
      img.src = category.image;
      img.onload = () => {
        setLoadedImages(prev => ({
          ...prev,
          [category.id]: true
        }));
      };
    });
  }, []);

  return (
    <section className="categories-section">
      <div className="container">
        <h2 className="section-title">Категории вакансий</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <div 
              key={category.id} 
              className="category-card"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="category-image-wrapper">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="category-image"
                  style={{ opacity: loadedImages[category.id] ? 1 : 0 }}
                />
                <div className="category-image-overlay"></div>
              </div>
              <h3 className="category-name">{category.name}</h3>
              <div className="category-job-count">{category.jobCount} вакансий</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default withRenderLogging(Category);