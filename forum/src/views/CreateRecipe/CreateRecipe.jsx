import { useState } from "react";
import { createRecipe } from "../../services/recipes.service";

export default function CreateRecipes() {
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
  });

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

    try {
      await createRecipe(title, description);
      alert('Recipe created successfully!');
      setRecipe({ title: '', description: '' });
    } catch (error) {
      alert('Failed to create recipe!');
    }
  };

  return (
    <>
      <h3>Create Recipe</h3>
      <div>
        <label htmlFor="title">Title: </label>
        <input value={recipe.title} onChange={e => updateRecipe('title', e.target.value)} type='text' name='title' id='title'/>
      </div>
      <div>
        <label htmlFor="description">Description: </label>
        <textarea value={recipe.description} onChange={e => updateRecipe('description', e.target.value)} name='description' id='description' cols='30' rows='10'/>
      </div>
      <button onClick={handleCreateRecipe}>Create</button>
    </>
  );
}
