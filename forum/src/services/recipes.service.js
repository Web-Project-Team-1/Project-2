import { ref, push, get, set } from "firebase/database";
import { db } from "../config/firebase-config";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export const createRecipe = async (title, description, image) => {
    const newRecipeRef = push(ref(db, 'recipes'));
    const id = newRecipeRef.key;

    let imageUrl = '';
    if (image) {
        const storage = getStorage();
        const imageRef = storageRef(storage, `recipes/${id}/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef); 
    }

    const recipe = { id, title, description, image: imageUrl, createdOn: new Date().toString() };

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
            await set(likeRef, null);
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
    await set(ref(db, `users/${userId}/favorites/${recipeId}`), { favorited: true });
};
