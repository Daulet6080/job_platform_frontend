import React, { useMemo, useState } from 'react';
import '../styles/Footer.css';

export default function Footer() {
  // Оптимизация для списка секций футера
  const footerSections = useMemo(() => [
    {
      title: 'Компаниям',
      links: ['IT', 'Стажировки', 'Рейтинг компании', 'Контакты']
    },
    {
      title: 'Партнерам',
      links: ['Сотрудничество', 'HR']
    },
    {
      title: 'Помощь',
      links: ['FAQ', 'Служба поддержки']
    },
    {
      title: 'О нас',
      links: ['О компании', 'История', 'Новости']
    }
  ], []);

  // Состояние для хранения количества кликов по подсекциям
  const [clickCounts, setClickCounts] = useState(Array(footerSections.length).fill(0).map(() => Array(footerSections[0].links.length).fill(0)));

  // Обработчик для клика по подсекции
  const handleLinkClick = (sectionIndex, linkIndex) => {
    const newClickCounts = [...clickCounts];
    newClickCounts[sectionIndex][linkIndex] += 1; // Увеличиваем количество кликов для этой подсекции
    setClickCounts(newClickCounts); // Обновляем состояние
    console.log(`Клик по "${footerSections[sectionIndex].links[linkIndex]}" в секции "${footerSections[sectionIndex].title}". Общее количество кликов: ${newClickCounts[sectionIndex][linkIndex]}`); // Вывод в консоль
  };

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-sections">
          {footerSections.map((section, sectionIndex) => (
            <div className="footer-section" key={sectionIndex}>
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#"
                      onClick={() => handleLinkClick(sectionIndex, linkIndex)} // Обработчик клика по подсекции
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}



