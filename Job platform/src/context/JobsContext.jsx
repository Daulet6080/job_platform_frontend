import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { jobsService } from '../services/jobsService';
import { categoriesService } from '../services/categoriesService';

const JobsContext = createContext(undefined);

export function useJobs() {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryDetails, setCategoryDetails] = useState(null);
  
  // Используем ref для предотвращения бесконечных запросов
  const isLoadingRef = useRef(false);
  const initialLoadDone = useRef(false);
  const initialUrlParamsProcessed = useRef(false);
  const prevFiltersRef = useRef(null);
  const prevPageRef = useRef(null);
  
  // Функция для сравнения объектов фильтров
  const areFiltersEqual = (filtersA, filtersB) => {
    if (!filtersA || !filtersB) return false;
    const keysA = Object.keys(filtersA);
    const keysB = Object.keys(filtersB);
    
    if (keysA.length !== keysB.length) return false;
    
    return keysA.every(key => filtersA[key] === filtersB[key]);
  };

  // Загрузка информации о категории для отображения имени категории
  const fetchCategoryDetails = useCallback(async (categoryId) => {
    if (!categoryId) return;
    
    try {
      const data = await categoriesService.getCategoryById(categoryId);
      if (data) {
        setCategoryDetails(data);
        console.log('Загружены данные категории:', data.name);
      }
    } catch (err) {
      console.error('Ошибка при загрузке данных категории:', err);
    }
  }, []);

  // Получаем параметры из URL при первой загрузке
  useEffect(() => {
    // Выполняем только один раз
    if (initialUrlParamsProcessed.current) return;
    initialUrlParamsProcessed.current = true;
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlFilters = {};
    
    // Добавляем все параметры из URL в фильтры
    for (const [key, value] of urlParams.entries()) {
      if (value) {
        urlFilters[key] = value;
      }
    }
    
    // Если есть параметры, устанавливаем их как начальные фильтры
    if (Object.keys(urlFilters).length > 0) {
      console.log('Инициализация фильтров из URL:', urlFilters);
      setFilters(urlFilters);
      
      // Если есть категория, загружаем её детали
      if (urlFilters.category) {
        fetchCategoryDetails(urlFilters.category);
      }
    }
  }, [fetchCategoryDetails]);

  // Загрузка вакансий с проверкой на дублирование запросов
  const fetchJobs = useCallback(async (page = 1, newFilters = null) => {
    // Проверяем, не выполняется ли уже запрос
    if (isLoadingRef.current) {
      console.log('Запрос уже выполняется, ожидаем...');
      return;
    }
    
    // Получаем текущие фильтры для запроса
    const requestFilters = newFilters || filters;
    
    // Проверяем, не дублируется ли запрос с теми же параметрами
    if (prevPageRef.current === page && 
        prevFiltersRef.current && 
        areFiltersEqual(prevFiltersRef.current, requestFilters)) {
      console.log('Пропускаем дублирующий запрос с теми же параметрами');
      return;
    }
    
    // Сохраняем текущие параметры запроса для будущих проверок
    prevPageRef.current = page;
    prevFiltersRef.current = {...requestFilters};
    
    // Ставим флаг загрузки
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      console.log('Загружаем вакансии:', {page, filters: requestFilters});
      
      // Параметры для запроса
      const params = {
        ...requestFilters,
        page
      };
      
      // Если выбрана категория, загружаем информацию о ней
      if (requestFilters.category && 
          (!categoryDetails || categoryDetails.id?.toString() !== requestFilters.category.toString())) {
        fetchCategoryDetails(requestFilters.category);
      } else if (!requestFilters.category && categoryDetails) {
        setCategoryDetails(null);
      }
      
      // Загружаем вакансии с явным указанием категории
      const data = await jobsService.getJobs(params);
      
      // Обновляем состояние
      setJobs(Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []));
      setTotalJobs(data.count || (Array.isArray(data) ? data.length : 0));
      setCurrentPage(page);
      
      console.log('Вакансии загружены:', {
        count: data.count || (Array.isArray(data.results) ? data.results.length : 0),
        page
      });
    } catch (err) {
      console.error('Ошибка при загрузке вакансий:', err);
      setError('Не удалось загрузить вакансии. Пожалуйста, попробуйте позже.');
      setJobs([]);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [filters, categoryDetails, fetchCategoryDetails]);

  // Обновление фильтров с дополнительной проверкой
  const updateFilters = useCallback((newFilters) => {
    // Проверяем, требуется ли обновление для параметра category
    const categoryChanged = 
      newFilters.hasOwnProperty('category') && 
      newFilters.category !== filters.category;
      
    // Создаем обновленные фильтры
    const updatedFilters = {...filters};
    
    // Удаляем пустые значения фильтров
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        delete updatedFilters[key];
      } else {
        updatedFilters[key] = value;
      }
    });
    
    // Если фильтры не изменились, не обновляем
    if (areFiltersEqual(filters, updatedFilters)) {
      console.log('Фильтры не изменились, пропускаем обновление');
      return;
    }
    
    console.log('Обновляем фильтры:', updatedFilters);
    
    // Обновляем URL без перезагрузки страницы
    const searchParams = new URLSearchParams();
    
    // Добавляем параметры в URL
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        searchParams.set(key, value);
      }
    });
    
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
    
    // Особая обработка для категории
    if (categoryChanged) {
      if (!newFilters.category) {
        console.log('Категория сброшена, очищаем детали категории');
        setCategoryDetails(null);
      } else if (newFilters.category !== filters.category) {
        console.log('Категория изменена, загружаем детали новой категории');
        fetchCategoryDetails(newFilters.category);
      }
    }
    
    // Устанавливаем новые фильтры и сбрасываем страницу
    setFilters(updatedFilters);
    if (categoryChanged) {
      setCurrentPage(1);
    }
  }, [filters, fetchCategoryDetails]);

  // Очистка фильтров
  const clearFilters = useCallback(() => {
    console.log('Очищаем все фильтры');
    // Очищаем кеш вакансий для получения актуальных данных
    jobsService.clearCache();
    
    setFilters({});
    setCurrentPage(1);
    setCategoryDetails(null);
    
    // Очищаем URL
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  // Загрузка вакансий при изменении фильтров или страницы
  useEffect(() => {
    // Запускаем загрузку только если приложение уже инициализировано
    if (initialLoadDone.current) {
      fetchJobs(currentPage);
    } else {
      // Помечаем первичную инициализацию выполненной
      initialLoadDone.current = true;
      
      // Загружаем начальные данные, если есть фильтр в URL
      if (Object.keys(filters).length > 0 || currentPage > 1) {
        fetchJobs(currentPage);
      }
    }
  }, [fetchJobs, currentPage, filters]);

  const value = {
    jobs,
    loading,
    error,
    filters,
    totalJobs,
    currentPage,
    categoryDetails,
    updateFilters,
    clearFilters,
    fetchJobs,
    setCurrentPage
  };

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
}