import React, { useEffect, useState, useContext } from 'react';
import { FavoritesContext } from '../../store/FavoritesContext';
import { AppContext } from '../../store/app.context';
import { getRecipe } from '../../services/recipes.service';
import Recipe from '../../components/Recipe/Recipe';
import './favorites.css';

const Favorites = () => {
    const { userData } = useContext(AppContext);
    const { favorites } = useContext(FavoritesContext);
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!userData?.handle) return;

            const recipes = [];
            const missingRecipes = [];

            for (const recipeId of favorites) {
                try {
                    const recipeData = await getRecipe(recipeId);
                    if (recipeData) {
                        recipes.push(recipeData);
                    } else {
                        missingRecipes.push(recipeId);
                        console.warn(`No data found for recipe ID: ${recipeId}`);
                    }
                } catch (error) {
                    console.error(`Error fetching recipe with ID ${recipeId}:`, error);
                    setError(`Error fetching recipe with ID ${recipeId}.`);
                }
            }

            if (missingRecipes.length > 0) {
                setError(`Some favorite recipes could not be found: ${missingRecipes.join(', ')}`);
            }

            setFavoriteRecipes(recipes);
        };

        fetchFavorites();
    }, [favorites, userData]);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='favorites-background'>
            <div className='favorites-grid'>
                {favoriteRecipes.length > 0 ? (
                    favoriteRecipes.map((recipe) => (
                        <Recipe
                            key={recipe.id}
                            id={recipe.id}
                            title={recipe.title}
                            description={recipe.description}
                            image={recipe.image}
                            creatorHandle={recipe.createdBy}
                            creationDate={recipe.creationDate}
                        />
                    ))
                ) : (
                    <p id="empty-favorites">No favorite recipes found.</p>
                )}
            </div>
        </div>
    );
};

export default Favorites;
