import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function ChangePasswordForm() {
    const { changePassword, logoutUser } = useContext(AuthContext);
    
    const [formData, setFormData] = useState({
        old_password: '',
        new_password1: '',
        new_password2: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Очищаем ошибки при изменении
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.old_password.trim()) {
            newErrors.old_password = 'Введите текущий пароль';
        }
        
        if (!formData.new_password1) {
            newErrors.new_password1 = 'Введите новый пароль';
        } else if (formData.new_password1.length < 8) {
            newErrors.new_password1 = 'Пароль должен содержать не менее 8 символов';
        }
        
        if (formData.new_password1 !== formData.new_password2) {
            newErrors.new_password2 = 'Пароли не совпадают';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsLoading(true);
            setSuccess(false);
            
            try {
                await changePassword(formData);
                
                setSuccess(true);
                setFormData({
                    old_password: '',
                    new_password1: '',
                    new_password2: ''
                });
                
                // Выход из системы после смены пароля
                setTimeout(() => {
                    logoutUser();
                    window.location.href = '/login';
                }, 3000);
            } catch (error) {
                const responseErrors = {};
                
                if (error.response && error.response.data) {
                    // Обрабатываем ошибки от бэкенда
                    Object.keys(error.response.data).forEach(key => {
                        responseErrors[key] = error.response.data[key].join(' ');
                    });
                    
                    // Если пришла общая ошибка
                    if (error.response.data.non_field_errors) {
                        responseErrors.general = error.response.data.non_field_errors.join(' ');
                    }
                    
                    // Проверяем ошибки старого пароля
                    if (error.response.data.old_password) {
                        responseErrors.old_password = error.response.data.old_password.join(' ');
                    }
                } else {
                    responseErrors.general = 'Произошла ошибка. Пожалуйста, попробуйте еще раз.';
                }
                
                setErrors(responseErrors);
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    return (
        <div className="settings-group">
            <h3>Сменить пароль</h3>
            
            {success && (
                <div className="success-message">
                    Пароль успешно изменен! Сейчас вы будете перенаправлены на страницу входа.
                </div>
            )}
            
            {errors.general && (
                <div className="error-message general-error">
                    {errors.general}
                </div>
            )}
            
            <form className="settings-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="old_password">Текущий пароль</label>
                    <input
                        type="password"
                        id="old_password"
                        name="old_password"
                        value={formData.old_password}
                        onChange={handleChange}
                        className={`form-input ${errors.old_password ? 'invalid' : ''}`}
                    />
                    {errors.old_password && <p className="error-message">{errors.old_password}</p>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="new_password1">Новый пароль</label>
                    <input
                        type="password"
                        id="new_password1"
                        name="new_password1"
                        value={formData.new_password1}
                        onChange={handleChange}
                        className={`form-input ${errors.new_password1 ? 'invalid' : ''}`}
                    />
                    {errors.new_password1 && <p className="error-message">{errors.new_password1}</p>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="new_password2">Подтвердите новый пароль</label>
                    <input
                        type="password"
                        id="new_password2"
                        name="new_password2"
                        value={formData.new_password2}
                        onChange={handleChange}
                        className={`form-input ${errors.new_password2 ? 'invalid' : ''}`}
                    />
                    {errors.new_password2 && <p className="error-message">{errors.new_password2}</p>}
                </div>
                
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Сохранение...' : 'Сменить пароль'}
                </button>
            </form>
        </div>
    );
}

export default ChangePasswordForm;