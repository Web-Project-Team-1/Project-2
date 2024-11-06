// App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContext } from "./store/app.context";
import { FavoritesProvider } from "./store/FavoritesContext";
import { useEffect, useState } from 'react';
import Home from './views/Home/Home';
import Register from "./views/Register/Register";
import { auth } from "./config/firebase-config";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserData } from './services/users.service';
import Header from './components/Header/Header';
import Login from "./views/Login/Login";
import Authenticated from "./hoc/Authenticated";
import CreateRecipe from "./views/CreateRecipe/CreateRecipe";
import AllRecipes from "./views/AllRecipes/AllRecipes";
import Profile from './views/Profile/Profile';
import Favorites from './views/Favorites/Favorites';
import NotFound from './views/NotFound/NotFound';
import { ProfileProvider } from './store/ProfileNamesContext';
import Discussions from './views/Discussions/Discussions';
import AdminDashboard from './components/AdminDashboard/AdminDashboard'; // Import AdminDashboard

function App() {
    const [appState, setAppState] = useState({
        user: null,
        userData: null,
        isAdmin: false
    });

    const [user, loading] = useAuthState(auth);

    const updateUser = (updatedUserData) => {
        setAppState((prevState) => ({
            ...prevState,
            userData: { ...prevState.userData, ...updatedUserData }
        }));
    };

    useEffect(() => {
        if (!user) {
            setAppState({ user: null, userData: null, isAdmin: false });
            return;
        }

        getUserData(user.uid).then(data => {
            setAppState({
                user,
                userData: data || null,
                isAdmin: data?.isAdmin || false  // Set isAdmin based on user data
            });
        });
    }, [user]);

    return (
        <BrowserRouter>
            <AppContext.Provider value={{ ...appState, setAppState, updateUser }}>
                <FavoritesProvider>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/recipes" element={<AllRecipes />} />
                        <Route path="/create-recipe" element={<Authenticated><CreateRecipe /></Authenticated>} />
                        <Route path="/discussions" element={<Authenticated><Discussions /></Authenticated>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={
                            <Authenticated>
                                <ProfileProvider>
                                    <Profile />
                                </ProfileProvider>
                            </Authenticated>
                        } />
                        <Route path="/favorites" element={<Authenticated><Favorites /></Authenticated>} />

                        {appState.isAdmin && <Route path="/admin" element={<AdminDashboard />} />}

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </FavoritesProvider>
            </AppContext.Provider>
        </BrowserRouter>
    );
}

export default App;
