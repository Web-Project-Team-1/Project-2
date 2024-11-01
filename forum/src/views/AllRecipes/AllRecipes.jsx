import React, { useEffect, useState } from 'react';
import { getAllRecipes } from '../../services/recipes.service';
import Recipe from '../../components/Recipe/Recipe'
import './AllRecipes.css';

export default function AllRecipes() {
    const [recipes, setRecipes] = useState([]);

    const fetchRecipes = async () => {
        try {
            const data = await getAllRecipes();
            if (data) {
                setRecipes(Object.values(data));
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
                {recipes.map((recipe, index) => (
                    <Recipe key={index} title={recipe.title} description={recipe.description} />
                ))}
            </div>
        </div>
    );
}