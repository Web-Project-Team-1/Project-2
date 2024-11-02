import { ref, push, get, set } from "firebase/database";
import { db } from "../config/firebase-config";

export const createRecipe = async (title, description) => {
    const newRecipeRef = push(ref(db, 'recipes'));
    const id = newRecipeRef.key;
    const recipe = { id, title, description, createdOn: new Date().toString() };

    try {
        await set(newRecipeRef, recipe);
        return id; 
    } catch (error) {
        console.error('Error creating recipe:', error);
        throw error; 
    }
};

export const getAllRecipes = async () => {
    try {
        const snapshot = await get(ref(db, 'recipes'));
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }
};

export const likeRecipe = async (recipeId, userId) => {
    if (!recipeId || !userId) return;

    const likeRef = ref(db, `recipes/${recipeId}/likes/${userId}`);
    const likeCountRef = ref(db, `recipes/${recipeId}/likeCount`);

    try {
        const isLiked = (await get(likeRef)).exists();
        await set(likeRef, isLiked ? null : { liked: true });

        const likeCountSnapshot = await get(likeCountRef);
        const currentLikeCount = likeCountSnapshot.val() || 0;
        await set(likeCountRef, currentLikeCount + (isLiked ? -1 : 1));
    } catch (error) {
        console.error("Error liking recipe:", error);
        throw error;
    }
};

export const addComment = async (recipeId, commentData) => {
    await push(ref(db, `recipes/${recipeId}/comments`), commentData);
};

export const getComments = async (recipeId) => {
    const snapshot = await get(ref(db, `recipes/${recipeId}/comments`));
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

export const addToFavorites = async (recipeId, userId) => {
    await set(ref(db, `users/${userId}/favorites/${recipeId}`), { favorited: true });
};
