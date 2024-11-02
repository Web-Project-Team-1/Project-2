import { useState } from "react";
import { createRecipe } from "../../services/recipes.service";

export default function CreateRecipes() {
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateRecipe = (key, value) => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      [key]: value,
    }));
  };

  const handleCreateRecipe = async () => {
    const { title, description } = recipe;

    if (!title || !description) {
      return alert('Please fill in all fields!');
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await createRecipe(title, description);
      alert('Recipe created successfully!');
      setRecipe({ title: '', description: '' });
    } catch (error) {
      alert('Failed to create recipe!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
      <button onClick={handleCreateRecipe} disabled={isSubmitting}>
        Create
      </button>
    </>
  );
}
