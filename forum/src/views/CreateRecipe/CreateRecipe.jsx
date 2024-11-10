import React, { useState, useContext } from "react";
import { createRecipe } from "../../services/recipes.service";
import { AppContext } from "../../store/app.context";
import { toast } from "react-toastify";
import "./CreateRecipe.css";
import { TITLE_MAX_LENGTH, TITLE_MIN_LENGTH, DESCRIPTION_MAX_LENGTH, DESCRIPTION_MIN_LENGTH } from "../../common/constants";

export default function CreateRecipes() {
  const { user, userData } = useContext(AppContext);
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    image: null,
    category: '',
    preparationTime: '',
    portions: '',
    ingredients: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateRecipe = (key, value) => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      [key]: value,
    }));
  };

  const handleCreateRecipe = async () => {
    const { title, description, image, category, preparationTime, portions, ingredients } = recipe;

    if (userData.isBlocked) {
      toast.error('You are blocked and cannot create recipes.');
      return;
    }

    if (!title || !description || !image || !category || !preparationTime || !portions || !ingredients) {
      toast.error('Please fill in all fields!');
      return;
    }

    if (title.length < TITLE_MIN_LENGTH || title.length > TITLE_MAX_LENGTH) {
      toast.error(`Title must be between ${TITLE_MIN_LENGTH} and ${TITLE_MAX_LENGTH} characters long.`);
      return;
    }

    if (description.length < DESCRIPTION_MIN_LENGTH || description.length > DESCRIPTION_MAX_LENGTH) {
      toast.error(`Description must be between ${DESCRIPTION_MIN_LENGTH} and ${DESCRIPTION_MAX_LENGTH} characters long.`);
      return;
    }

    if (!user || !userData?.handle) {
      toast.error('User is not logged in or username is missing.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createRecipe(
        title,
        description,
        image,
        category,
        preparationTime,
        portions,
        ingredients,
        userData.handle
      );
      toast.success('Recipe created successfully!');
      setRecipe({
        title: '',
        description: '',
        image: null,
        category: '',
        preparationTime: '',
        portions: '',
        ingredients: ''
      });
    } catch (error) {
      toast.error('Failed to create recipe!');
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
    <div className="recipe-background">
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
          <label htmlFor="category">Category:</label>
          <select
            value={recipe.category}
            onChange={e => updateRecipe('category', e.target.value)}
            name="category"
            id="category"
          >
            <option value="">Select a category</option>
            <option value="Desserts">Desserts</option>
            <option value="Healthy">Healthy</option>
            <option value="Vegan">Vegan</option>
            <option value="Salads">Salads</option>
            <option value="JunkFood">JunkFood</option>
          </select>
        </div>
        <div>
          <label htmlFor="preparationTime">Preparation Time (mins):</label>
          <input
            value={recipe.preparationTime}
            onChange={e => updateRecipe('preparationTime', e.target.value)}
            type="number"
            name="preparationTime"
            id="preparationTime"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="portions">Portions:</label>
          <input
            value={recipe.portions}
            onChange={e => updateRecipe('portions', e.target.value)}
            type="number"
            name="portions"
            id="portions"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="ingredients">Ingredients:</label>
          <textarea
            value={recipe.ingredients}
            onChange={e => updateRecipe('ingredients', e.target.value)}
            name="ingredients"
            id="ingredients"
            cols="30"
            rows="5"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input className="recipe-image-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button onClick={handleCreateRecipe} disabled={isSubmitting}>
          Create
        </button>
      </div>
    </div>
  );
}
