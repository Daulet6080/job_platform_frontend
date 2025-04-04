import React from 'react';
import { useJobs } from '../context/JobsContext';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import '../styles/JobListPage.css';

function JobListPage() {
  const { filteredJobs, selectedCity } = useJobs();
  
  return (
    <div>
      <Header />
      <NavigationBar />
      <div className="jobs-container">
        <div className="jobs-header">
          <h1>Вакансии в городе {selectedCity}</h1>
          <p>Найдено {filteredJobs.length} вакансий</p>
        </div>
        
        <div className="filters-section">
          <h3>Фильтры</h3>
          <div className="filter-options">
            <div className="filter-group">
              <label>Опыт работы:</label>
              <select>
                <option value="">Любой</option>
                <option value="no-experience">Без опыта</option>
                <option value="1-3">От 1 до 3 лет</option>
                <option value="3-6">От 3 до 6 лет</option>
                <option value="6+">Более 6 лет</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Зарплата от:</label>
              <input type="number" placeholder="Минимальная зарплата" />
            </div>
            
            <button className="apply-filters">Применить</button>
          </div>
        </div>
        
        <div className="jobs-list">
          {filteredJobs.length === 0 ? (
            <div className="no-jobs-message">
              <p>В городе {selectedCity} пока нет доступных вакансий.</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default JobListPage;