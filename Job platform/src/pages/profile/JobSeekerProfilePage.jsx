import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function JobSeekerProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

            if (!token) {
                navigate('/login'); // Перенаправляем на страницу логина, если нет токена
                return;
            }

            try {
                const response = await fetch('/api/users/jobseeker/profile/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Ошибка получения профиля: ${response.status} - ${JSON.stringify(errorData)}`);
                }

                const data = await response.json();
                setProfileData(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
                console.error('Ошибка при получении профиля:', error);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return <div>Загрузка профиля...</div>;
    }

    if (error) {
        return <div>Ошибка при загрузке профиля: {error}</div>;
    }

    if (!profileData) {
        return <div>Профиль не найден.</div>;
    }

    return (
        <div className="profile-page-container">
            <h2 className="profile-title">Профиль соискателя</h2>
            <div className="profile-info">
                {profileData.user && (
                    <>
                        <div className="profile-item">
                            <strong>Имя пользователя:</strong> {profileData.user.username}
                        </div>
                        <div className="profile-item">
                            <strong>Email:</strong> {profileData.user.email}
                        </div>
                        {profileData.user.phone && (
                            <div className="profile-item">
                                <strong>Телефон:</strong> {profileData.user.phone}
                            </div>
                        )}
                        {profileData.user.photo && (
                            <div className="profile-item">
                                <strong>Фото:</strong> <img src={profileData.user.photo} alt="Фото профиля" className="profile-photo" style={{ maxWidth: '100px' }} />
                            </div>
                        )}
                    </>
                )}
                {profileData.languages && (
                    <div className="profile-item">
                        <strong>Языки:</strong> {profileData.languages}
                    </div>
                )}
                {/* Здесь можно будет добавить отображение других полей из JobSeeker (skills, bio, city) позже, если они появятся в API */}
            </div>
            <button onClick={() => navigate('/profile/jobseeker/edit')} className="edit-profile-button">
                Редактировать профиль
            </button>
        </div>
    );
}

export default JobSeekerProfilePage;