import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Загружаем избранные вакансии из localStorage
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleRemoveFromFavorites = (id) => {
    const updatedFavorites = favorites.filter(job => job.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Обновляем избранное в localStorage
  };

  return (
    <div className="favorites">
      <div>
        <h1>Избранные вакансии</h1>
      </div>
      {favorites.length === 0 ? (
        <p>Вы еще не добавили вакансии в избранное</p>
      ) : (
        <div className='favorites-container'>
          <ul className='cards'>
            {favorites.map(job => (
              <li key={job.id} className="favorites-item">
                <img src={job.logo} alt={job.title} className="favorites-item-image" />
                <div className='favorites-info'>
                  <h2>{job.title}</h2>
                  <p>{job.company}</p>
                  <p>{job.salary ? `${job.salary}₽` : 'Зарплата не указана'}</p>
                  <button onClick={() => handleRemoveFromFavorites(job.id)}>Удалить из избранного</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="favorites-actions">
             <Link to="/jobs">
               <button className="browse-jobs-btn">Поиск вакансий</button>
             </Link>
          </div>
        </div>
      )}
    </div>
  );
}
