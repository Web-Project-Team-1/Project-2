import { NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../../resources/cooking.png';
import { useContext } from 'react';
import { AppContext } from '../../store/app.context';
import { logoutUser } from "../../services/auth.service";
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const logout = () => {
        logoutUser()
            .then(() => {
                setAppState({ user: null, userData: null });
                navigate('/login');
            })
            .catch((error) => {
                console.error('Logout failed', error);
            });
    };

    return (
        <header className="header">
            <nav>
                <NavLink to="/recipes" className="nav-navlink">Recipes</NavLink>
                <div className="logo">
                    <NavLink to="/">
                        <img src={logo} alt="Flavor Fusion Logo" />
                    </NavLink>
                </div>
                {user ? (
                    <>
                        <NavLink to="/create-recipe" className="nav-navlink">Create Recipe</NavLink>
                        <p className="welcome-message">Welcome, {userData?.handle}</p>
                    </>
                ) : (
                    <div className="auth-navlinks">
                        <NavLink to="/register" className="nav-navlink">Register</NavLink>
                        <NavLink to="/login" className="nav-navlink">Login</NavLink>
                    </div>
                )}
            </nav>
            {user && <button onClick={logout} className="logout-btn">Logout</button>}
        </header>
    );
}
