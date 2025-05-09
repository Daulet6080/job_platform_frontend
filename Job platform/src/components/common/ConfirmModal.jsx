import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/Modal.css';

const ConfirmModal = ({ 
    title, 
    message, 
    confirmText = 'Подтвердить', 
    cancelText = 'Отмена',
    onConfirm, 
    onCancel, 
    isDestructive = true 
}) => {
    useEffect(() => {
        // Блокируем прокрутку body когда модальное окно открыто
        document.body.style.overflow = 'hidden';
        
        return () => {
            // Восстанавливаем прокрутку при закрытии
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Обработчик нажатия клавиши ESC для закрытия модального окна
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                onCancel();
            }
        };
        
        window.addEventListener('keydown', handleEsc);
        
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onCancel]);

    return (
        <div className="modal-overlay">
            <div className="modal-container" role="dialog" aria-modal="true">
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onCancel} aria-label="Закрыть">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
                <div className="modal-content">
                    <p>{message}</p>
                </div>
                <div className="modal-actions">
                    <button 
                        className="btn btn-secondary" 
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button 
                        className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

ConfirmModal.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isDestructive: PropTypes.bool
};

export default ConfirmModal;