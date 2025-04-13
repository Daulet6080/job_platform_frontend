import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-mark">JP</div>
                <div className="footer-logo-text">
                  <span>JobPlatform</span>
                </div>
              </div>
              <p className="footer-tagline">Платформа для поиска работы и развития карьеры</p>
              <div className="footer-social">
                <a href="https://facebook.com" className="social-icon" aria-label="Facebook">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M13.397,20.997v-8.196h2.765l0.411-3.209h-3.176V7.548c0-0.926,0.258-1.56,1.587-1.56h1.684V3.127 C15.849,3.039,15.025,2.997,14.201,3c-2.444,0-4.122,1.492-4.122,4.231v2.355H7.332v3.209h2.753v8.202H13.397z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" className="social-icon" aria-label="Twitter">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" className="social-icon" aria-label="Instagram">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" className="social-icon" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="footer-links-group">
              <h4 className="footer-title">Соискателям</h4>
              <ul className="footer-links">
                <li><Link to="/jobs">Поиск вакансий</Link></li>
                <li><Link to="/resume">Создать резюме</Link></li>
                <li><Link to="/favorites">Избранные вакансии</Link></li>
                <li><Link to="/career-advice">Советы по карьере</Link></li>
                <li><Link to="/salary-calculator">Калькулятор зарплат</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-group">
              <h4 className="footer-title">Работодателям</h4>
              <ul className="footer-links">
                <li><Link to="/post-job">Разместить вакансию</Link></li>
                <li><Link to="/talent-search">Поиск кандидатов</Link></li>
                <li><Link to="/employer-branding">Брендинг работодателя</Link></li>
                <li><Link to="/recruitment-solutions">Решения для рекрутинга</Link></li>
                <li><Link to="/pricing">Тарифы</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-group">
              <h4 className="footer-title">Компания</h4>
              <ul className="footer-links">
                <li><Link to="/about">О нас</Link></li>
                <li><Link to="/contact">Контакты</Link></li>
                <li><Link to="/blog">Блог</Link></li>
                <li><Link to="/press">Пресс-центр</Link></li>
                <li><Link to="/careers">Карьера у нас</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-group">
              <h4 className="footer-title">Контакты</h4>
              <ul className="footer-contact-info">
                <li>
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>Астана, пр. Мангилик Ел, 55/2</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <span>+7 (7172) 11-34-56</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span>info@jobplatform.kz</span>
                </li>
              </ul>
              <div className="footer-download">
                <h4 className="footer-title">Скачайте приложение</h4>
                <div className="store-buttons">
                  <a href="/app/android" className="store-button">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor" d="M17.36,9.27L7.19,2.47a1.25,1.25,0,0,0-1.28,0,1.23,1.23,0,0,0-.62,1.07V21a1.23,1.23,0,0,0,.62,1.07,1.25,1.25,0,0,0,1.28,0l10.17-6.8a1.27,1.27,0,0,0,0-2.08ZM5.84,9.27,14.33,12,5.84,14.73ZM22,12a1.26,1.26,0,0,1-.62,1.07l-1.09.63-1.08-.63V11.37l1.08-.63,1.09.63A1.25,1.25,0,0,1,22,12ZM17.56,5.73,19,6.54a1.25,1.25,0,0,1,.62,1.07,1.23,1.23,0,0,1-.62,1.07l-1.09.63L16.48,8.6V6.56ZM16.48,15.4l1.09.63,1.09-.63a1.23,1.23,0,0,1,.62,1.07,1.25,1.25,0,0,1-.62,1.07l-1.47.81Z"/>
                    </svg>
                    <span>Google Play</span>
                  </a>
                  <a href="/app/ios" className="store-button">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor" d="M17.05,13.49a4.61,4.61,0,0,0,2.76-4.34A4.71,4.71,0,0,0,16.06,4.5,5.86,5.86,0,0,0,12,6.1,5.86,5.86,0,0,0,7.94,4.5,4.71,4.71,0,0,0,4.19,9.15a4.61,4.61,0,0,0,2.76,4.34A16.49,16.49,0,0,0,2,21.5H3.68a14.8,14.8,0,0,1,3.26-5.58,14.8,14.8,0,0,1,5.12-3.51A3.09,3.09,0,0,1,12,16.5a3,3,0,0,1,0-6,3,3,0,0,1-.06,6,14.8,14.8,0,0,1,5.12,3.51A14.8,14.8,0,0,1,20.32,21.5H22A16.49,16.49,0,0,0,17.05,13.49Z"/>
                    </svg>
                    <span>App Store</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">© 2025 JobPlatform. Все права защищены.</p>
            <div className="footer-bottom-links">
              <Link to="/terms">Условия использования</Link>
              <Link to="/privacy">Политика конфиденциальности</Link>
              <Link to="/cookies">Файлы cookie</Link>
              <Link to="/sitemap">Карта сайта</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;