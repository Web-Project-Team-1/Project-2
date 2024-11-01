import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContext } from "./store/app.context";
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

function App() {
    const [appState, setAppState] = useState({
        user: null,
        userData: null
    });

    const [user] = useAuthState(auth);

    useEffect(() => {
        if (!user) return;

        getUserData(user.uid).then(data => {
            if (data && Object.keys(data).length > 0) {
                const userData = data[Object.keys(data)[0]];
                setAppState({ user, userData });
            } else {
                setAppState({ user, userData: null });
            }
        });
    }, [user]);

    return (
        <BrowserRouter>
            <AppContext.Provider value={{ ...appState, setAppState }}>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/recipes" element={<AllRecipes />} />
                    <Route path="/create-recipe" element={<Authenticated><CreateRecipe /></Authenticated>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Authenticated><Profile /></Authenticated>} />
                    <Route path="/favorites" element={<Authenticated><Favorites /></Authenticated>} />
                </Routes>
            </AppContext.Provider>
        </BrowserRouter>
    );
}

export default App;