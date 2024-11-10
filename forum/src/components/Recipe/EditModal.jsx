import React, { useState } from 'react';
import './EditModal.css';
import { updateRecipe } from '../../services/recipes.service';

const EditModal = ({ onClose, recipeId, currentTitle, currentDescription, currentIngredients, currentPreparationTime, currentPortions, refetchRecipes }) => {
    const [title, setTitle] = useState(currentTitle);
    const [description, setDescription] = useState(currentDescription);
    const [ingredients, setIngredients] = useState(currentIngredients);
    const [preparationTime, setPreparationTime] = useState(currentPreparationTime);
    const [portions, setPortions] = useState(currentPortions);

    const handleSave = async () => {
        try {
            await updateRecipe(recipeId, { title, description, ingredients, preparationTime, portions });
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
                
                <p>Ingredients</p>
                <textarea
                    className="edit-modal-input"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="List of Ingredients"
                />
                
                <p>Preparation Time (minutes)</p>
                <input
                    type="number"
                    className="edit-modal-input"
                    value={preparationTime}
                    onChange={(e) => setPreparationTime(e.target.value)}
                    placeholder="Preparation Time"
                />

                <p>Portions</p>
                <input
                    type="number"
                    className="edit-modal-input"
                    value={portions}
                    onChange={(e) => setPortions(e.target.value)}
                    placeholder="Number of Portions"
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
