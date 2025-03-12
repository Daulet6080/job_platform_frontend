import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import JobList from '../components/JobList'; // Компонент списка вакансий
import '../styles/JobsPage.css';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';
import BannerCarusel from '../components/BannerCarusel';
import { setSearchTerm } from '../store'; 

// Пример данных вакансий
export const jobsData = [
  { 
      id: 1, 
      title: 'Frontend-разработчик', 
      salary: 150000, 
      image: '/frontend.jpg', 
      categoryId: 1, 
      description: 'Разработка пользовательских интерфейсов на React. Требования: опыт от 2 лет, знание JavaScript и TypeScript.' 
  },
  { 
      id: 2, 
      title: 'DevOps-инженер', 
      salary: 180000, 
      image: '/devops.jpg', 
      categoryId: 2, 
      description: 'Настройка CI/CD, работа с Kubernetes и Docker. Требования: опыт работы с облачными платформами.' 
  },
  { 
      id: 3, 
      title: 'Аналитик данных', 
      salary: 130000, 
      image: '/data-analyst.jpg', 
      categoryId: 3, 
      description: 'Сбор и анализ данных, создание дашбордов. Требования: знание SQL, Python и Pandas.' 
  },
  { 
      id: 4, 
      title: 'Системный администратор', 
      salary: 120000, 
      image: '/sysadmin.jpg', 
      categoryId: 2, 
      description: 'Поддержка серверной инфраструктуры, мониторинг и настройка сети. Опыт работы с Linux.' 
  },
  { 
      id: 5, 
      title: 'Тестировщик ПО', 
      salary: 110000, 
      image: '/qa.jpg', 
      categoryId: 4, 
      description: 'Тестирование веб-приложений, написание тест-кейсов. Требования: опыт в ручном и автоматизированном тестировании.' 
  },
];

export default function JobsPage() {
  const dispatch = useDispatch();
  const { searchTerm } = useSelector(state => state.search);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Обновление поискового запроса
  const handleSearch = (searchText) => {
    dispatch(setSearchTerm(searchText));
  };

  // Фильтрация вакансий по поисковому запросу и категории
  const filteredJobs = useMemo(() => {
    const filteredByCategory = categoryParam 
      ? jobsData.filter(job => job.categoryId === parseInt(categoryParam)) 
      : jobsData;

    return filteredByCategory.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, categoryParam]);

  return (
    <div>
      <Header />
      <NavigationBar onSearch={handleSearch} /> 
      <BannerCarusel />
      <div className="jobs-page">
        <h1>Вакансии</h1>
        <JobList jobs={filteredJobs} />
      </div>
    </div>
  );
}
