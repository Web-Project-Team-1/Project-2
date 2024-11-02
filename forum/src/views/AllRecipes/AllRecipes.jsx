import React, { useEffect, useState } from 'react';
import { getAllRecipes } from '../../services/recipes.service';
import Recipe from '../../components/Recipe/Recipe';
import './AllRecipes.css';

export default function AllRecipes() {
    const [recipes, setRecipes] = useState([]);

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

    useEffect(() => {
        fetchRecipes();
    }, []);

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
                        />
                    ))
                ) : (
                    <p>No recipes available.</p>
                )}
            </div>
        </div>
    );
}
