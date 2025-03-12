// components/Category.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Category.css';
import withRenderLogging from './withRenderLogging';

const categories = [
  { id: 1, name: 'Frontend-разработка', image: 'frontend.jpg' },
  { id: 2, name: 'Backend-разработка', image: 'backend.jpg' },
  { id: 3, name: 'Дизайн UX/UI', image: 'design.png' },
  { id: 4, name: 'Тестирование ПО', image: 'qa.jpg' },
  { id: 5, name: 'DevOps и инфраструктура', image: 'devops.jpg' },
  { id: 6, name: 'Аналитика данных', image: 'data_analytics.png' },
  { id: 7, name: 'Кибербезопасность', image: 'cybersecurity.jpg' },
  { id: 8, name: 'Проектный менеджмент', image: 'pm.png' },
  { id: 9, name: 'Техническая поддержка', image: 'support.jpg' },
  { id: 10, name: 'Облачные технологии', image: 'cloud.jpg' }
];

function Category() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/jobs?category=${categoryId}`);
  };

  return (
    <div className="categories-section">
      <h2 className="categories-title">Категории вакансий</h2>
      <div className="categories-grid">
        {categories.map(category => (
          <div 
            key={category.id} 
            className="category-card"
            onClick={() => handleCategoryClick(category.id)}
          >
            <img src={category.image} alt={category.name} className="category-image" />
            <h3 className="category-name">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

// Оборачиваем компонент HOC-ом
export default withRenderLogging(Category);
