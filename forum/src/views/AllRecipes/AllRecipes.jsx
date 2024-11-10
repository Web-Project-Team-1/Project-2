import React, { useEffect, useState } from 'react';
import { getAllRecipes } from '../../services/recipes.service';
import Recipe from '../../components/Recipe/Recipe';
import './AllRecipes.css';
import EditModal from '../../components/Recipe/EditModal';
import { getAuth } from 'firebase/auth';

export default function AllRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentRecipe, setCurrentRecipe] = useState(null);
    const [sortOrder, setSortOrder] = useState("newest");
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isAnonymousUser, setIsAnonymousUser] = useState(true);

    const fetchRecipes = async () => {
        try {
            const data = await getAllRecipes();
            let validRecipes = Object.values(data).filter(recipe =>
                recipe.title && recipe.description && recipe.image
            );
    
            if (selectedCategory) {
                validRecipes = validRecipes.filter(recipe => recipe.category === selectedCategory);
            }
    
            if (isAnonymousUser) {
                const mostCommented = validRecipes
                    .slice()
                    .sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0))
                    .slice(0, 10);
    
                const mostRecent = validRecipes
                    .slice()
                    .sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))
                    .slice(0, 10);
    
                const combinedRecipes = Array.from(new Set([...mostCommented, ...mostRecent]));
                setRecipes(combinedRecipes);
            } else {
                setRecipes(validRecipes);
            }
        } catch (error) {
            console.error("Failed to load recipes:", error);
        }
    };    

    const handleRecipeDelete = (deletedRecipeId) => {
        setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== deletedRecipeId));
    };

    useEffect(() => {
        const auth = getAuth();
        auth.onAuthStateChanged(user => {
            setIsAnonymousUser(!user);
            fetchRecipes();
        });
    }, [selectedCategory]);

    const handleEdit = (recipe) => {
        setCurrentRecipe(recipe);
        setShowEditModal(true);
    };

    const sortedRecipes = recipes.slice().sort((a, b) => {
        if (sortOrder === "newest") {
            return new Date(b.creationDate) - new Date(a.creationDate);
        } else if (sortOrder === "oldest") {
            return new Date(a.creationDate) - new Date(b.creationDate);
        } else if (sortOrder === "a-z") {
            return a.title.localeCompare(b.title);
        } else if (sortOrder === "z-a") {
            return b.title.localeCompare(a.title);
        }
        return 0;
    });

    return (
        <div className="all-recipes-background">
            <div className="sort-options">
                <label htmlFor="category" className="sort-label">Category:</label>
                <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="sort-select"
                >
                    <option value="">All</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Salads">Salads</option>
                    <option value="JunkFood">JunkFood</option>
                </select>

                <label htmlFor="sortOrder" className="sort-label">Sort by:</label>
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
                            category={recipe.category}
                            preparationTime={recipe.preparationTime}
                            portions={recipe.portions}
                            ingredients={recipe.ingredients}
                            creatorHandle={recipe.createdBy}
                            creationDate={recipe.creationDate}
                            onEdit={() => handleEdit(recipe)}
                            onDelete={handleRecipeDelete}
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
                    currentImage={currentRecipe.image}
                    currentCategory={currentRecipe.category}
                    currentPreparationTime={currentRecipe.preparationTime}
                    currentPortions={currentRecipe.portions}
                    currentIngredients={currentRecipe.ingredients}
                    refetchRecipes={fetchRecipes}
                />
            )}
        </div>
    );
}
