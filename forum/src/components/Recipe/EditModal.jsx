import React, { useState } from 'react';
import './EditModal.css';
import { updateRecipe } from '../../services/recipes.service';

const EditModal = ({ onClose, recipeId, currentTitle, currentDescription, refetchRecipes }) => {
    const [title, setTitle] = useState(currentTitle);
    const [description, setDescription] = useState(currentDescription);

    const handleSave = async () => {
        try {
            await updateRecipe(recipeId, { title, description });
            refetchRecipes();
            onClose();
        } catch (error) {
            console.error("Error updating recipe:", error);
        }
    };

    return (
        <div className="edit-modal-overlay" onClick={onClose}>
            <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="edit-modal-title">Edit Recipe</h3>
                <p>Title</p>
                <input
                    type="text"
                    className="edit-modal-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Recipe Title"
                />
                <p>Description</p>
                <textarea
                    className="edit-modal-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Recipe Description"
                />

                <div className="edit-modal-buttons">
                    <button className="edit-save-button" onClick={handleSave}>Save Changes</button>
                    <button className="edit-cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
