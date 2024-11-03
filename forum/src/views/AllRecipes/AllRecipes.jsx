import React, { useEffect, useState } from 'react';
import { getAllRecipes } from '../../services/recipes.service';
import Recipe from '../../components/Recipe/Recipe';
import './AllRecipes.css';
import EditModal from '../../components/Recipe/EditModal'; // Assuming you have the EditModal component imported

export default function AllRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentRecipe, setCurrentRecipe] = useState(null);

    const fetchRecipes = async () => {
        try {
            const data = await getAllRecipes();
            if (data) {
                const validRecipes = Object.values(data).filter(recipe =>
                    recipe.title && recipe.description && recipe.image
                );
                setRecipes(validRecipes);
            } else {
                console.log("No recipes found in the database.");
            }
        } catch (error) {
            console.error("Failed to load recipes:", error);
        }
    };

    // Create a refetch function
    const refetchRecipes = () => {
        fetchRecipes(); // Call the fetchRecipes function
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const handleEdit = (recipe) => {
        setCurrentRecipe(recipe);
        setShowEditModal(true);
    };

    return (
        <div className="all-recipes-background">
            <div className="recipes-grid">
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <Recipe
                            key={recipe.id}
                            id={recipe.id}
                            title={recipe.title}
                            description={recipe.description}
                            image={recipe.image}
                            creatorHandle={recipe.createdBy}
                            onEdit={() => handleEdit(recipe)} // Add an edit handler
                        />
                    ))
                ) : (
                    <p>No recipes available.</p>
                )}
            </div>
            {showEditModal && currentRecipe && (
                <EditModal
                    onClose={() => setShowEditModal(false)}
                    recipeId={currentRecipe.id}
                    currentTitle={currentRecipe.title}
                    currentDescription={currentRecipe.description}
                    refetchRecipes={refetchRecipes} // Pass refetch function to EditModal
                />
            )}
        </div>
    );
}
