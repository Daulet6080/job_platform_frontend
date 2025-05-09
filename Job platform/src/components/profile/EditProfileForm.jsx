import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function EditProfileForm({ initialData, onSuccess }) {
    const { updateProfile } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        first_name: initialData?.user?.first_name || '',
        last_name: initialData?.user?.last_name || '',
        email: initialData?.user?.email || '',
        phone: initialData?.user?.phone || '',
        bio: initialData?.bio || ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.first_name.trim()) {
            newErrors.first_name = 'Имя обязательно';
        }
        
        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Фамилия обязательна';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Некорректный формат email';
        }
        
        if (formData.phone && !/^(\+?[0-9]\d{9,14})$/.test(formData.phone)) {
            newErrors.phone = 'Некорректный формат телефона';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            const updatedProfile = await updateProfile({
                user: {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    phone: formData.phone
                },
                bio: formData.bio
            });
            
            if (onSuccess) {
                onSuccess(updatedProfile);
            }
        } catch (error) {
            const responseErrors = {};
            
            if (error.response && error.response.data) {
                // Обработка вложенных ошибок (если user - это вложенный объект)
                if (error.response.data.user) {
                    Object.keys(error.response.data.user).forEach(key => {
                        responseErrors[key] = error.response.data.user[key].join(' ');
                    });
                }
                
                // Обработка ошибок на верхнем уровне объекта
                Object.keys(error.response.data).forEach(key => {
                    if (key !== 'user') {
                        responseErrors[key] = error.response.data[key].join(' ');
                    }
                });
                
                if (error.response.data.non_field_errors) {
                    responseErrors.general = error.response.data.non_field_errors.join(' ');
                }
            } else {
                responseErrors.general = 'Произошла ошибка. Пожалуйста, попробуйте еще раз.';
            }
            
            setErrors(responseErrors);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <form className="settings-form" onSubmit={handleSubmit}>
            {errors.general && (
                <div className="error-message general-error">
                    {errors.general}
                </div>
            )}
            
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="first_name">Имя</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={`form-input ${errors.first_name ? 'invalid' : ''}`}
                    />
                    {errors.first_name && <p className="error-message">{errors.first_name}</p>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="last_name">Фамилия</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={`form-input ${errors.last_name ? 'invalid' : ''}`}
                    />
                    {errors.last_name && <p className="error-message">{errors.last_name}</p>}
                </div>
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'invalid' : ''}`}
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="phone">Телефон</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`form-input ${errors.phone ? 'invalid' : ''}`}
                    />
                    {errors.phone && <p className="error-message">{errors.phone}</p>}
                </div>
            </div>
            
            <div className="form-group">
                <label htmlFor="bio">О себе</label>
                <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className={`form-input ${errors.bio ? 'invalid' : ''}`}
                    rows="4"
                ></textarea>
                {errors.bio && <p className="error-message">{errors.bio}</p>}
            </div>
            
            <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
            >
                {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
        </form>
    );
}

export default EditProfileForm;