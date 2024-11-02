import { useState } from "react";
import { createRecipe } from "../../services/recipes.service";

export default function CreateRecipes() {
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

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await createRecipe(title, description, image);
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
    <>
      <h3>Create Recipe</h3>
      <div>
        <label htmlFor="title">Title:</label>
        <input value={recipe.title} onChange={e => updateRecipe('title', e.target.value)} type="text" name="title" id="title" autoComplete="off"
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea value={recipe.description} onChange={e => updateRecipe('description', e.target.value)} name="description" id="description" cols="30" rows="10" autoComplete="off"
        />
      </div>
      <div>
        <label htmlFor="image">Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} 
        />
      </div>
      <button onClick={handleCreateRecipe} disabled={isSubmitting}>
        Create
      </button>
    </>
  );
}
