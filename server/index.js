import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const recipes = [
  {
    id: 1,
    title: 'Classic Spaghetti',
    description: 'A delicious spaghetti recipe with a homemade tomato sauce.',
    createdOn: new Date(),
    liked: false,
  }
];
let nextRecipeId = 2;

app.get('/recipes', (req, res) => {
  if (req.query.search) {
    res.json(recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(req.query.search.toLowerCase())
    ));
    return;
  }
  
  res.json(recipes);
});

app.get('/recipes/:id', (req, res) => {
  const recipe = recipes.find(recipe => recipe.id === +req.params.id);

  if (!recipe) {
    res.sendStatus(404);
    return;
  }

  res.json(recipe);
});

app.post('/recipes', (req, res) => {
  const recipe = {
    id: nextRecipeId++,
    title: req.body.title,
    description: req.body.description,
    liked: false,
    createdOn: new Date(),
  };
  recipes.push(recipe);

  res.json(recipe);
});

app.put('/recipes/:id', (req, res) => {
  const recipe = recipes.find(recipe => recipe.id === +req.params.id);

  if (!recipe) {
    res.sendStatus(404);
    return;
  }
  
  recipe.title = req.body.title;
  recipe.description = req.body.description;
  recipe.liked = req.body.liked;

  res.json(recipe);
});

app.delete('/recipes/:id', (req, res) => {
  const index = recipes.findIndex(recipe => recipe.id === +req.params.id);

  if (index === -1) {
    res.sendStatus(404);
    return;
  }
  recipes.splice(index, 1);

  res.sendStatus(204);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
