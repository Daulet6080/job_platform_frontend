import React, { createContext, useContext, useState, useEffect } from 'react';

const JobsContext = createContext();

const jobsData = [
  {
    id: 1,
    title: 'Frontend-разработчик React',
    company: 'ТехноПлюс',
    city: 'Алматы',
    salary: '300 000 - 450 000 ₸',
    description: 'Требуется опытный frontend-разработчик со знанием React и современных технологий.',
    requirements: ['React', 'JavaScript', 'CSS', 'HTML', 'Git'],
    date: '2025-04-01',
  },
  {
    id: 2,
    title: 'Backend-разработчик Python',
    company: 'ДатаСофт',
    city: 'Нур-Султан',
    salary: '400 000 - 600 000 ₸',
    description: 'Разработка и поддержка серверной части приложений на Python.',
    requirements: ['Python', 'Django', 'PostgreSQL', 'REST API'],
    date: '2025-04-02',
  },
  {
    id: 3,
    title: 'UI/UX дизайнер',
    company: 'Креатив Дизайн',
    city: 'Алматы',
    salary: '350 000 - 500 000 ₸',
    description: 'Создание пользовательских интерфейсов для мобильных и веб-приложений.',
    requirements: ['Figma', 'Adobe XD', 'Photoshop', 'Sketch'],
    date: '2025-04-03',
  },
  {
    id: 4,
    title: 'DevOps инженер',
    company: 'КлаудТех',
    city: 'Нур-Султан',
    salary: '500 000 - 700 000 ₸',
    description: 'Настройка и поддержка инфраструктуры, автоматизация процессов.',
    requirements: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    date: '2025-04-01',
  },
  {
    id: 5,
    title: 'Менеджер проектов',
    company: 'БизнесЛаб',
    city: 'Шымкент',
    salary: '400 000 - 550 000 ₸',
    description: 'Управление IT проектами, координация работы команды разработчиков.',
    requirements: ['Agile', 'Scrum', 'Jira', 'MS Project'],
    date: '2025-04-04',
  },
  {
    id: 6,
    title: 'QA инженер',
    company: 'ТехноПлюс',
    city: 'Алматы',
    salary: '250 000 - 350 000 ₸',
    description: 'Тестирование программного обеспечения, автоматизация тестов.',
    requirements: ['Selenium', 'Jest', 'Postman', 'SQL'],
    date: '2025-04-02',
  },
  {
    id: 7,
    title: 'Android-разработчик',
    company: 'МобильныеРешения',
    city: 'Шымкент',
    salary: '400 000 - 550 000 ₸',
    description: 'Разработка мобильных приложений для Android.',
    requirements: ['Java', 'Kotlin', 'Android SDK', 'SQLite'],
    date: '2025-04-03',
  }
];

export function JobsProvider({ children }) {
  const savedCity = localStorage.getItem('city') || 'Алматы';
  const [selectedCity, setSelectedCity] = useState(savedCity);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [allJobs] = useState(jobsData);

  const updateSelectedCity = (city) => {
    setSelectedCity(city);
  };

  useEffect(() => {
    if (!selectedCity) {
      setFilteredJobs(allJobs);
      return;
    }
    
    const filtered = allJobs.filter(job => job.city === selectedCity);
    setFilteredJobs(filtered);
  }, [selectedCity, allJobs]);

  return (
    <JobsContext.Provider value={{ 
      allJobs,
      filteredJobs,
      selectedCity, 
      updateSelectedCity
    }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}