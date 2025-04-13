import React, { useMemo } from 'react';
import '../styles/Pagination.css';

export default function Pagination({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  maxVisiblePages = 5 
}) {
  // Вычисляем общее количество страниц
  const totalPages = useMemo(() => 
    Math.ceil(totalItems / itemsPerPage), 
    [totalItems, itemsPerPage]
  );

  // Если одна страница или меньше, не показываем пагинацию
  if (totalPages <= 1) return null;

  // Функция для генерации номеров страниц с учетом текущей страницы
  const getPageNumbers = () => {
    // Если общее количество страниц меньше или равно максимальному отображаемому,
    // просто возвращаем все страницы
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Вычисляем, сколько страниц отображать до и после текущей
    const sidePages = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(currentPage - sidePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
    
    // Если мы уперлись в правую границу, сдвигаем левую
    if (endPage === totalPages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const pages = [];
    
    // Добавляем первую страницу и многоточие, если нужно
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }
    
    // Добавляем номера страниц
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Добавляем многоточие и последнюю страницу, если нужно
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Обработчики навигации
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Обработчик клика по номеру страницы
  const handlePageClick = (page) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Получаем массив страниц для отображения
  const pageNumbers = getPageNumbers();

  return (
    <nav className="pagination-container" aria-label="Навигация по страницам">
      <ul className="pagination">
        <li className={`pagination-item prev ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="pagination-link"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            aria-label="Предыдущая страница"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
        </li>
        
        {pageNumbers.map((page, index) => (
          <li 
            key={`${page}-${index}`} 
            className={`pagination-item ${
              page === currentPage ? 'active' : (page === '...' ? 'dots' : '')
            }`}
          >
            {page === '...' ? (
              <span className="pagination-dots">...</span>
            ) : (
              <button
                className="pagination-link"
                onClick={() => handlePageClick(page)}
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={`Страница ${page}`}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        
        <li className={`pagination-item next ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="pagination-link"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            aria-label="Следующая страница"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        </li>
      </ul>
      
      <div className="pagination-info">
        Страница {currentPage} из {totalPages}
      </div>
    </nav>
  );
}