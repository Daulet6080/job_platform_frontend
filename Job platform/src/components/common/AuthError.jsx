import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/Common.css';

const AuthError = ({ message, onClose, showTryAgain, onTryAgain }) => {
    return (
        <div className="auth-error">
            <div className="auth-error-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                </svg>
            </div>
            <div className="auth-error-content">
                <h4>Ошибка аутентификации</h4>
                <p>{message}</p>
                <div className="auth-error-actions">
                    {showTryAgain && (
                        <button 
                            className="btn-try-again" 
                            onClick={onTryAgain}
                        >
                            Попробовать снова
                        </button>
                    )}
                    {onClose && (
                        <button 
                            className="btn-close" 
                            onClick={onClose}
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

AuthError.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    showTryAgain: PropTypes.bool,
    onTryAgain: PropTypes.func
};

AuthError.defaultProps = {
    showTryAgain: false
};

export default AuthError;