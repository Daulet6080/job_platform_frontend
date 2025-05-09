import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/Common.css';

const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
    const spinnerClasses = `loading-spinner spinner-${size} spinner-${color}`;
    
    return (
        <div className={spinnerClasses}></div>
    );
};

LoadingSpinner.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'white'])
};

export default LoadingSpinner;