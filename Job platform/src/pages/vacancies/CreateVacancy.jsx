import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../../styles/CreateVacancy.css';

function CreateVacancy() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [salary_from, setSalaryFrom] = useState('');
    const [salary_to, setSalaryTo] = useState('');
    const [work_type, setWorkType] = useState('FULL');
    const [experience_required, setExperienceRequired] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem('user'))?.token;

        if (!token) {
            console.error('Токен авторизации отсутствует.');
            return;
        }

        const vacancyData = {
            title,
            description,
            category,
            location,
            salary_from: salary_from || null,
            salary_to: salary_to || null,
            work_type,
            experience_required,
        };

        try {
            const response = await fetch('/api/vacancies/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(vacancyData),
            });

            if (response.ok) {
                console.log('Вакансия успешно создана!');
                navigate('/employer/dashboard'); // Перенаправляем на дашборд после успешного создания
                // Можно добавить здесь логику для отображения уведомления об успехе
            } else {
                const errorData = await response.json();
                console.error('Ошибка при создании вакансии:', errorData);
                // Здесь можно реализовать отображение сообщения об ошибке пользователю
            }
        } catch (error) {
            console.error('Произошла ошибка:', error);
            // Здесь можно реализовать отображение сообщения об ошибке пользователю
        }
    };

    return (
        <div className="create-vacancy-container">
            <h1>Создать вакансию</h1>
            <form onSubmit={handleSubmit} className="create-vacancy-form">
                <div className="form-group">
                    <label htmlFor="title">Название вакансии:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Описание:</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                              required/>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Категория:</label>
                    <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="location">Местоположение:</label>
                    <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)}/>
                </div>
                <div className="form-group salary">
                    <label htmlFor="salary_from">Зарплата от:</label>
                    <input type="number" id="salary_from" value={salary_from}
                           onChange={(e) => setSalaryFrom(e.target.value)}/>
                    <label htmlFor="salary_to">до:</label>
                    <input type="number" id="salary_to" value={salary_to}
                           onChange={(e) => setSalaryTo(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="work_type">Тип работы:</label>
                    <select id="work_type" value={work_type} onChange={(e) => setWorkType(e.target.value)}>
                        <option value="FULL">Полный рабочий день</option>
                        <option value="PART">Частичная занятость</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="experience_required">Требуемый опыт:</label>
                    <input type="text" id="experience_required" value={experience_required}
                           onChange={(e) => setExperienceRequired(e.target.value)}/>
                </div>
                <button type="submit" className="create-button">Создать вакансию</button>
                <button type="button" onClick={() => navigate('/employer/dashboard')} className="cancel-button">Отмена
                </button>
            </form>
        </div>
    );
}

export default CreateVacancy;