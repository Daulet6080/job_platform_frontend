import React, { useState, useEffect } from 'react';
import '../styles/BannerCarusel.css';

const banners = [
  { img: '/job-vacancy.jpg', text: 'Найди свою первую IT-работу' },
  { img: '/job-vacancy2.jpg', text: 'Топ вакансии для разработчиков' },
  
];

export default function BannerCarusel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="banner-carousel">
      <img
        src={banners[currentIndex].img}
        alt="Баннер вакансий"
        className="banner-image"
      />
      <div className="banner-text">{banners[currentIndex].text}</div>
      
      <div className="pagination">
        {banners.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
