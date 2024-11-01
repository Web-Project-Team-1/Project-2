import React, { useState } from 'react';
import './Recipe.css';

const Recipe = ({ title, description }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const openModal = () => setIsExpanded(true);
    const closeModal = () => setIsExpanded(false);

    return (
        <>
            <div className="recipe-card" onClick={openModal}>
                <h3 className={`recipe-title ${isExpanded ? 'active' : ''}`}>{title}</h3>
            </div>
            {isExpanded && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">{title}</h2>
                        <p className="modal-description">{description}</p>
                        <button className="close-button" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Recipe;