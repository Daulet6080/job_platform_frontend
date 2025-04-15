import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Dashboard.css';
import Footer from "../../components/Footer.jsx";

function EmployerDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    const companyName = user?.companyName || 'Название компании';
    const companyDescription = 'Описание компании будет здесь...';

    return (
        <div className="employer-dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <img src="/company-logo.png" alt="Логотип компании" className="company-logo" />
                    <div>
                        <h1>{companyName}</h1>
                        <p>Описание компании будет здесь...</p>
                    </div>
                </div>

                <div className="header-right">
                    <Link to="/profile/employer/edit" className="edit-button">Редактировать</Link>
                    <Link to="/chat" className="chat-button">Чат</Link>
                </div>
            </header>

            <main className="dashboard-content">
                <section className="vacancies-section">
                    <div className="section-header">
                        <h2>Вакансии компании</h2>
                        <Link to="/vacancies/create" className="add-vacancy-button">+ Добавить вакансию</Link>
                    </div>
                    <ul className="vacancies-list">
                        {/* Здесь будут карточки вакансий */}
                        <li className="vacancy-card">Пример вакансии</li>
                    </ul>
                </section>

                <hr className="section-divider" />

                <section className="reviews-section">
                    <h2>Отзывы о компании</h2>
                    <ul className="reviews-list">
                        <li className="review-card">
                            <div className="review-header">
                                <strong>Иван Петров</strong>
                                <div className="stars">
                                    ★★★★☆
                                </div>
                            </div>
                            <p className="review-text">
                                Отличная компания с дружным коллективом. Рекомендую!
                            </p>
                        </li>
                        {/* Другие отзывы */}
                    </ul>
                </section>
            </main>
            <Footer/>
        </div>
    );
}

export default EmployerDashboard;
