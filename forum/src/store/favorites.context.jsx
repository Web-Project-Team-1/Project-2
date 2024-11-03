import React, { createContext, useState, useEffect, useContext } from "react";
import { ref, set, get, remove } from "firebase/database";
import { db } from "../config/firebase-config";
import { AppContext } from "./app.context";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const { user } = useContext(AppContext);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const fetchFavorites = async () => {
        if (!user) return;
        try {
            const snapshot = await get(ref(db, `users/${user.uid}/favorites`));
            const favoritesData = snapshot.exists() ? snapshot.val() : {};
            setFavorites(Object.keys(favoritesData));
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    const addToFavorites = async (recipeId) => {
        if (!user) return;
        try {
            await set(ref(db, `users/${user.uid}/favorites/${recipeId}`), { favorited: true });
            setFavorites((prev) => [...prev, recipeId]);
        } catch (error) {
            console.error("Error adding to favorites:", error);
        }
    };

    const removeFromFavorites = async (recipeId) => {
        if (!user) return;
        try {
            await remove(ref(db, `users/${user.uid}/favorites/${recipeId}`));
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
