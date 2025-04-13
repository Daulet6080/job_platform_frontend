import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/BannerCarusel.css';

// Данные для слайдов
const banners = [
  {
    id: 1,
    title: "Найдите работу своей мечты",
    description: "Более 10,000 актуальных вакансий от ведущих компаний",
    image: "https://i.pinimg.com/736x/f1/37/b1/f137b1914b1b9358e9ff9c0a76b852f3.jpg"
  },
  {
    id: 2,
    title: "Работа в технологических компаниях",
    description: "Вакансии в самых инновационных стартапах и корпорациях",
    image: "https://i.pinimg.com/736x/f6/9f/8a/f69f8aded90c13e633ecfab6c598b9d5.jpg"
  },
  {
    id: 3,
    title: "Удаленная работа без границ",
    description: "Найдите работу с гибким графиком из любой точки мира",
    image: "https://i.pinimg.com/736x/64/f4/b9/64f4b917b5f20f134174031fa7565c31.jpg"
  }
];

export default function BannerCarusel() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Функция для перехода к следующему слайду
  const goToNextBanner = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const nextBanner = (currentBanner + 1) % banners.length;
    
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentBanner(nextBanner);
      setIsTransitioning(false);
    }, 600);
  }, [currentBanner, isTransitioning]);
  
  // Функция для перехода к конкретному слайду
  const goToDot = useCallback((index) => {
    if (isTransitioning || index === currentBanner) return;
    
    setIsTransitioning(true);
    
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentBanner(index);
      setIsTransitioning(false);
    }, 600);
  }, [currentBanner, isTransitioning]);
  
  // Обработка клавиатуры
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      const prevBanner = (currentBanner - 1 + banners.length) % banners.length;
      goToDot(prevBanner);
    } else if (e.key === 'ArrowRight') {
      const nextBanner = (currentBanner + 1) % banners.length;
      goToDot(nextBanner);
    }
  }, [currentBanner, goToDot]);
  
  // Обработка свайпов для мобильных устройств
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };
  
  const handleSwipe = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    
    // Минимальное расстояние для определения свайпа (в пикселях)
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        // Свайп влево - следующий слайд
        const nextBanner = (currentBanner + 1) % banners.length;
        goToDot(nextBanner);
      } else {
        // Свайп вправо - предыдущий слайд
        const prevBanner = (currentBanner - 1 + banners.length) % banners.length;
        goToDot(prevBanner);
      }
    }
  };
  
  // Установка автоматического перехода с интервалом в 5 секунд
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(goToNextBanner, 5000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [goToNextBanner, isPaused]);
  
  // Предзагрузка изображений для плавного отображения
  useEffect(() => {
    banners.forEach(banner => {
      const img = new Image();
      img.src = banner.image;
    });
  }, []);
  
  // Добавление обработчика событий клавиатуры
  useEffect(() => {
    carouselRef.current?.focus();
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  return (
    <section 
      className="banner-carousel"
      ref={carouselRef}
      tabIndex="0"
      aria-label="Карусель баннеров"
      role="region"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="container">
        <div className="carousel-container">
          {banners.map((banner, index) => (
            <div 
              key={banner.id}
              className={`carousel-slide ${index === currentBanner ? 'active' : ''} ${isTransitioning && index === currentBanner ? 'transitioning' : ''}`}
              style={{ backgroundImage: `url(${banner.image})` }}
              aria-hidden={index !== currentBanner}
              role="group"
              aria-roledescription="slide"
              aria-label={`Слайд ${index + 1} из ${banners.length}`}
            >
              <div className="carousel-content">
                <h2 className="carousel-title">{banner.title}</h2>
                <p className="carousel-description">{banner.description}</p>
              </div>
            </div>
          ))}
          
          <div 
            className="carousel-dots" 
            role="tablist" 
            aria-label="Навигация по слайдам"
          >
            {banners.map((_, index) => (
              <button 
                key={index}
                className={`carousel-dot ${currentBanner === index ? 'active' : ''}`}
                onClick={() => goToDot(index)}
                aria-label={`Перейти к слайду ${index + 1}`}
                aria-selected={currentBanner === index}
                role="tab"
                tabIndex={currentBanner === index ? 0 : -1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}