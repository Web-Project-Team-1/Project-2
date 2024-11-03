import React, { useEffect, useState, useContext } from 'react';
import { FavoritesContext } from '../../store/favorites.context';
import { AppContext } from '../../store/app.context';
import { getRecipe } from '../../services/recipes.service';
import Recipe from '../../components/Recipe/Recipe';
import './favorites.css';

const Favorites = () => {
    const { user } = useContext(AppContext);
    const { favorites } = useContext(FavoritesContext);
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user) return;

            const recipes = [];
            for (const recipeId of favorites) {
                try {
                    const recipeData = await getRecipe(recipeId);
                    if (recipeData) {
                        recipes.push(recipeData);
                    } else {
                        console.warn(`No data found for recipe ID: ${recipeId}`);
                    }
                } catch (error) {
                    console.error(`Error fetching recipe with ID ${recipeId}:`, error);
                    setError(`Error fetching recipe with ID ${recipeId}.`);
                }
            }
            setFavoriteRecipes(recipes);
        };

        fetchFavorites();
    }, [favorites, user]);

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
