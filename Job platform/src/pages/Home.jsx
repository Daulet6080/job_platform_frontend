import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import Category from '../components/Category';
import BannerCarusel from '../components/BannerCarusel';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../App.css';

// Данные категорий ( они определены здесь пока что)
const categoriesData = [
    { id: 1, name: 'Frontend-разработка', image: 'frontend.jpg' },
    { id: 2, name: 'Backend-разработка', image: 'backend.jpg' },
    { id: 3, name: 'Дизайн UX/UI', image: 'design.png' },
    { id: 4, name: 'Тестирование ПО', image: 'qa.jpg' },
    { id: 5, name: 'DevOps и инфраструктура', image: 'devops.jpg' },
    { id: 6, name: 'Аналитика данных', image: 'data_analytics.png' },
    { id: 7, name: 'Кибербезопасность', image: 'cybersecurity.jpg' },
    { id: 8, name: 'Проектный менеджмент', image: 'pm.png' },
    { id: 9, name: 'Техническая поддержка', image: 'support.jpg' },
    { id: 10, name: 'Облачные технологии', image: 'cloud.jpg' }
];

export default function Home() {
    const [filteredCategories, setFilteredCategories] = useState(categoriesData);

    const handleSearch = (searchText) => {
        const searchTermLower = searchText.toLowerCase();
        if (searchText.trim() === '') {
            // Если поле поиска пустое, возвращаем все категории
            setFilteredCategories(categoriesData);
        } else {
            // Иначе фильтруем категории по тексту поиска
            const results = categoriesData.filter(category =>
                category.name.toLowerCase().includes(searchTermLower)
            );
            setFilteredCategories(results);
        }
    };

    return (
        <div>
            <Header />
            <NavigationBar onSearch={handleSearch} />
            <BannerCarusel />
            <Category categories={filteredCategories} />
            <Footer />
        </div>
    );
}