import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'blue', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600',
    green: 'text-green-600',
    red: 'text-red-600'
  };

  const spinner = (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-4 border-solid border-current border-r-transparent ${sizeClasses[size]} ${colorClasses[color]}`}></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {spinner}
          <p className="mt-4 text-center text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;