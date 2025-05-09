import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../../context/AuthContext';


const ProtectedRoute = ({ children, requiredRole, redirectPath = '/login' }) => {
    const { currentUser, loading } = useContext(AuthContext);
    const location = useLocation();
    
    if (loading) {
        return (
            <div className="auth-loading">
                <div className="loading-spinner"></div>
                <p>Проверка авторизации...</p>
            </div>
        );
    }
    
    if (!currentUser) {
        return <Navigate to={`${redirectPath}?next=${encodeURIComponent(location.pathname)}`} replace />;
    }
    
    if (requiredRole && currentUser.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    requiredRole: PropTypes.string,
    redirectPath: PropTypes.string
};

export default ProtectedRoute;