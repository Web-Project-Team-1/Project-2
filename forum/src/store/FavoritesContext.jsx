import React, { createContext, useState, useEffect, useContext } from "react";
import { ref, set, get, remove } from "firebase/database";
import { db } from "../config/firebase-config";
import { AppContext } from "./app.context";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const { userData } = useContext(AppContext); // Use userData instead of user
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (userData?.handle) {
            fetchFavorites();
        }
    }, [userData]);

    const fetchFavorites = async () => {
        if (!userData?.handle) return;
        try {
            const snapshot = await get(ref(db, `users/${userData.handle}/favorites`));
            const favoritesData = snapshot.exists() ? snapshot.val() : {};
            setFavorites(Object.keys(favoritesData));
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    const addToFavorites = async (recipeId) => {
        if (!userData?.handle) return;
        try {
            await set(ref(db, `users/${userData.handle}/favorites/${recipeId}`), { favorited: true });
            setFavorites((prev) => [...prev, recipeId]);
        } catch (error) {
            console.error("Error adding to favorites:", error);
        }
    };

    const removeFromFavorites = async (recipeId) => {
        if (!userData?.handle) return;
        try {
            await remove(ref(db, `users/${userData.handle}/favorites/${recipeId}`));
            setFavorites((prev) => prev.filter((id) => id !== recipeId));
        } catch (error) {
            console.error("Error removing from favorites:", error);
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};
