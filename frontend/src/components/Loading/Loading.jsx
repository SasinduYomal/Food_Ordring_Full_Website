import React from 'react';
import './Loading.css';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-center"></div>
        </div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
};

export default Loading;