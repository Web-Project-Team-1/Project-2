import { ref, push, get, set, remove } from "firebase/database";
import { db } from "../config/firebase-config";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";

export const createRecipe = async (title, description, image, creatorUsername) => {
    const newRecipeRef = push(ref(db, 'recipes'));
    const id = newRecipeRef.key;
    const creationDate = new Date().toISOString();

    let imageUrl = '';
    if (image) {
        const storage = getStorage();
        const imageRef = storageRef(storage, `recipes/${id}/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef); 
    }

    const recipe = { 
        id, 
        title, 
        description, 
        image: imageUrl, 
        createdOn: new Date().toString(),
        createdBy: creatorUsername,
        creationDate,
    };

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
        const userLikeSnapshot = await get(likeRef);

        if (userLikeSnapshot.exists()) {
            await remove(likeRef);
            const likeCountSnapshot = await get(likeCountRef);
            const currentLikeCount = likeCountSnapshot.val() || 0;
            await set(likeCountRef, Math.max(0, currentLikeCount - 1));
            return false;
        } else {
            await set(likeRef, { liked: true });
            const likeCountSnapshot = await get(likeCountRef);
            const currentLikeCount = likeCountSnapshot.val() || 0;
            await set(likeCountRef, currentLikeCount + 1);
            return true;
        }
    } catch (error) {
        console.error("Error liking recipe:", error);
        throw error;
    }
};

export const getRecipeLikes = async (recipeId, userId) => {
    const likeCountRef = ref(db, `recipes/${recipeId}/likeCount`);
    const userLikeRef = ref(db, `recipes/${recipeId}/likes/${userId}`);

    try {
        const [likeCountSnapshot, userLikeSnapshot] = await Promise.all([
            get(likeCountRef),
            get(userLikeRef),
        ]);
        
        return {
            likeCount: likeCountSnapshot.exists() ? likeCountSnapshot.val() : 0,
            userLiked: userLikeSnapshot.exists(),
        };
    } catch (error) {
        console.error("Error fetching like data:", error);
        throw error;
    }
};

export const addComment = async (recipeId, commentData) => {
    const commentRef = ref(db, `recipes/${recipeId}/comments`);
    const newCommentRef = push(commentRef);
    await set(newCommentRef, commentData);
};

export const getComments = async (recipeId) => {
    const snapshot = await get(ref(db, `recipes/${recipeId}/comments`));
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

export const addToFavorites = async (recipeId, userId) => {
    try {
        await set(ref(db, `users/${userId}/favorites/${recipeId}`), { favorited: true });
    } catch (error) {
        console.error("Error adding to favorites:", error);
        throw error;
    }
};

export const removeFromFavorites = async (recipeId, userId) => {
    try {
        await remove(ref(db, `users/${userId}/favorites/${recipeId}`));
    } catch (error) {
        console.error("Error removing from favorites:", error);
        throw error;
    }
};

export const getUserFavorites = async (userId) => {
    try {
        const snapshot = await get(ref(db, `users/${userId}/favorites`));
        return snapshot.exists() ? Object.keys(snapshot.val()) : [];
    } catch (error) {
        console.error("Error fetching user favorites:", error);
        throw error;
    }
};

export const getRecipe = async (recipeId) => {
    try {
        const snapshot = await get(ref(db, `recipes/${recipeId}`));
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.warn(`No data found for recipe ID: ${recipeId}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching recipe with ID ${recipeId}:`, error);
        throw error;
    }
};

export const updateRecipe = async (recipeId, updates) => {
    try {
        const recipeRef = ref(db, `recipes/${recipeId}`);
        const snapshot = await get(recipeRef);
        if (!snapshot.exists()) {
            throw new Error(`Recipe with ID ${recipeId} does not exist.`);
        }

        const existingRecipe = snapshot.val();
        await set(recipeRef, { ...existingRecipe, ...updates, id: recipeId });
    } catch (error) {
        console.error(`Error updating recipe with ID ${recipeId}:`, error);
        throw error;
    }
};

export const deleteRecipe = async (recipeId) => {
    try {
        const recipeRef = ref(db, `recipes/${recipeId}`);
        await remove(recipeRef);
    } catch (error) {
        console.error("Error deleting recipe:", error);
        throw error;
    }
};

export async function getRecipeCount() {
    const recipesRef = ref(db, 'recipes');
    const snapshot = await get(recipesRef);
    return snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
  }