import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ProfilePage.css';

function EmployerProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const userDetails = JSON.parse(localStorage.getItem('user'));
        // const employerProfileEndpoint = '/api/employers/profile/'; // Предполагаемый эндпоинт

        // if (!token) {
        //     setError('Нет токена авторизации.');
        //     setLoading(false);
        //     return;
        // }
        if (!token) {
            console.log("Нет токена авторизации, используем данные из localStorage.");
            if (userDetails) {
                // Временно используем данные которые сохранены при регистрации
                setProfileData({
                    companyName: userDetails.companyName || '',
                    email: userDetails.email || '',
                    username: userDetails.username || '',
                });
            }  else {
                console.log("Нет данных пользователя в localStorage.");
                setProfileData({})
                setError(null);
            }
            setLoading(false);
            return;
        }

        // fetch(employerProfileEndpoint, {
        //     headers: {
        //         'Authorization': `Bearer ${token}`,
        //     },
        // })
        //     .then(response => {
        //         if (!response.ok) {
        //             return response.json().then(data => {
        //                 throw new Error(data?.message || `Ошибка получения профиля: ${response.status}`);
        //             });
        //         }
        //         return response.json();
        //     })
        //     .then(data => {
        //         setProfileData(data);
        //         setLoading(false);
        //     })
        //     .catch(error => {
        //         setError(error.message);
        //         setLoading(false);
        //     });
    }, []);

    const handleEditProfile = () => {
        navigate('/profile/employer/edit'); // Предполагаемый маршрут для редактирования
    };

    if (loading) {
        return <div className="profile-page">Загрузка профиля...</div>;
    }

    if (error) {
        return <div className="profile-page error">Ошибка: {error}</div>;
    }

    if (!profileData) {
        return <div className="profile-page">Профиль не найден.</div>;
    }
    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-left">
                    <img
                        src="/images/default-profile.jpg" // заменишь на динамическую ссылку позже
                        alt="Фото профиля"
                        className="profile-photo"
                    />
                    <button className="change-photo-button">Изменить фото</button>
                </div>

                <div className="profile-right">
                    <h1>Профиль Работодателя</h1>
                    <div className="profile-info">
                        <span className="label">Название компании:</span>
                        <span className="value">{profileData?.companyName || ''}</span>
                    </div>
                    <div className="profile-info">
                        <span className="label">Имя пользователя:</span>
                        <span className="value">{profileData?.username || ''}</span>
                    </div>
                    <div className="profile-info">
                        <span className="label">Email:</span>
                        <span className="value">{profileData?.email || ''}</span>
                    </div>
                    <button className="edit-button" onClick={handleEditProfile}>
                        Редактировать профиль
                    </button>
                </div>
            </div>
        </div>
    );



    // return (
    //     <div className="profile-page">
    //         <h1>Профиль Работодателя</h1>
    //         {/* Предполагаемая структура данных профиля */}
    //         {profileData.company_name && (
    //             <div className="profile-info">
    //                 <span className="label">Название компании:</span>
    //                 <span className="value">{profileData.company_name}</span>
    //             </div>
    //         )}
    //         {profileData.description && (
    //             <div className="profile-info">
    //                 <span className="label">Описание:</span>
    //                 <span className="value">{profileData.description}</span>
    //             </div>
    //         )}
    //         {profileData.contact_person && (
    //             <div className="profile-info">
    //                 <span className="label">Контактное лицо:</span>
    //                 <span className="value">{profileData.contact_person}</span>
    //             </div>
    //         )}
    //         {profileData.email && (
    //             <div className="profile-info">
    //                 <span className="label">Email:</span>
    //                 <span className="value">{profileData.email}</span>
    //             </div>
    //         )}
    //         {profileData.phone && (
    //             <div className="profile-info">
    //                 <span className="label">Телефон:</span>
    //                 <span className="value">{profileData.phone}</span>
    //             </div>
    //         )}
    //         {/* Добавьте другие поля профиля, которые вы ожидаете */}
    //
    //         <button className="edit-button" onClick={handleEditProfile}>
    //             Редактировать профиль
    //         </button>
    //     </div>
    // );
}

export default EmployerProfilePage;