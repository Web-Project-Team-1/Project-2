import React, { useState, useContext } from "react";
import { createRecipe } from "../../services/recipes.service";
import { AppContext } from "../../store/app.context";
import "./CreateRecipe.css";

export default function CreateRecipes() {
  const { user, userData } = useContext(AppContext); // Access userData
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateRecipe = (key, value) => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      [key]: value,
    }));
  };

  const handleCreateRecipe = async () => {
    const { title, description, image } = recipe;

    if (!title || !description || !image) {
      return alert('Please fill in all fields!');
    }

    if (!user || !userData?.handle) { // Check userData.handle
      alert('User is not logged in or username is missing.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Pass userData.handle when calling createRecipe
      await createRecipe(title, description, image, userData.handle);
      alert('Recipe created successfully!');
      setRecipe({ title: '', description: '', image: null });
    } catch (error) {
      alert('Failed to create recipe!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setRecipe(prevRecipe => ({ ...prevRecipe, image: file }));
    }
  };

  return (
    <div className="create-recipe-container">
      <h3>Create Recipe</h3>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          value={recipe.title}
          onChange={e => updateRecipe('title', e.target.value)}
          type="text"
          name="title"
          id="title"
          autoComplete="off"
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          value={recipe.description}
          onChange={e => updateRecipe('description', e.target.value)}
          name="description"
          id="description"
          cols="30"
          rows="10"
          autoComplete="off"
        />
      </div>
      <div>
        <label htmlFor="image">Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <button onClick={handleCreateRecipe} disabled={isSubmitting}>
        Create
      </button>
    </div>
  );
}
