import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jobsService } from '../services/jobsService';

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
  
  const fetchJobs = useCallback(async (page = 1, newFilters = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters = newFilters || filters;
      const params = {
        ...currentFilters,
        page
      };
      
      const data = await jobsService.getJobs(params);
      setJobs(data.results || data);
      setTotalJobs(data.count || data.length);
      setCurrentPage(page);
    } catch (err) {
      console.error('Ошибка при загрузке вакансий:', err);
      setError('Не удалось загрузить вакансии. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  }, [filters]); 

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [fetchJobs, currentPage]);

  const value = {
    jobs,
    loading,
    error,
    filters,
    totalJobs,
    currentPage,
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