import React, { useEffect, useState } from 'react';
import { getAllRecipes } from '../../services/recipes.service';
import Recipe from '../../components/Recipe/Recipe';
import './AllRecipes.css';
import EditModal from '../../components/Recipe/EditModal';

export default function AllRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentRecipe, setCurrentRecipe] = useState(null);
    const [sortOrder, setSortOrder] = useState("newest"); // Default to newest first

    // Fetch recipes from the service
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

    // Refetch recipes after edit
    const refetchRecipes = () => {
        fetchRecipes();
    };

    // Fetch recipes on component mount
    useEffect(() => {
        fetchRecipes();
    }, []);

    // Handle opening the edit modal
    const handleEdit = (recipe) => {
        setCurrentRecipe(recipe);
        setShowEditModal(true);
    };

    // Sorting function for recipes based on sortOrder
    const sortedRecipes = recipes.slice().sort((a, b) => {
        if (sortOrder === "newest") {
            return new Date(b.creationDate) - new Date(a.creationDate); // Newest first
        } else if (sortOrder === "oldest") {
            return new Date(a.creationDate) - new Date(b.creationDate); // Oldest first
        } else if (sortOrder === "a-z") {
            return a.title.localeCompare(b.title); // Alphabetical A-Z
        } else if (sortOrder === "z-a") {
            return b.title.localeCompare(a.title); // Alphabetical Z-A
        }
        return 0;
    });

    // AllRecipes.jsx

    // AllRecipes.jsx

    return (
        <div className="all-recipes-background">
            <div className="sort-options">
                <label htmlFor="sortOrder" className="sort-label">Sort by: </label>
                <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="sort-select"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="a-z">Title (A-Z)</option>
                    <option value="z-a">Title (Z-A)</option>
                </select>
            </div>

            <div className="recipes-grid">
                {sortedRecipes.length > 0 ? (
                    sortedRecipes.map((recipe) => (
                        <Recipe
                            key={recipe.id}
                            id={recipe.id}
                            title={recipe.title}
                            description={recipe.description}
                            image={recipe.image}
                            creatorHandle={recipe.createdBy}
                            creationDate={recipe.creationDate}
                            onEdit={() => handleEdit(recipe)}
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
                    refetchRecipes={refetchRecipes}
                />
            )}
        </div>
    );
}