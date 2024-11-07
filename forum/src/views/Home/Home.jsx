import React, { useEffect, useState } from 'react';
import { getUserCount } from '../../services/users.service';
import { getRecipeCount } from '../../services/recipes.service';
import './Home.css';

export default function Home() {
  const [userCount, setUserCount] = useState(0);
  const [recipeCount, setRecipeCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const users = await getUserCount();
        const recipes = await getRecipeCount();
        setUserCount(users);
        setRecipeCount(recipes);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="home-page">
      <div className="home-background">
        <div className="home-container">
          <h1 className="welcome-text">Welcome to Flavor Fusion</h1>
          <div className="counter">
            <p>Total of users in Flavor Fusion 👉 {userCount}</p>
            <p>Total of recipes in Flavor Fusion 👉 {recipeCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
