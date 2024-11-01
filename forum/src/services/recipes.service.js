import { ref, push, update } from "firebase/database"; 
import { db } from "../config/firebase-config";

export const createRecipe = async (title, description) => {
    const recipe = {
        title,
        description,
        createdOn: new Date().toString(),
    };

    try {
        const result = await push(ref(db, 'recipes'), recipe);
        const id = result.key;
        await update(ref(db, 'recipes', id), { id });
        return id; 
    } catch (error) {
        console.error('Error creating recipe:', error);
        throw error; 
    }
};
