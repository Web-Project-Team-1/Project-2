import { NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../../resources/cooking.png';
import defaultProfilePic from '../../resources/default-profile-pic.jpg';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../store/app.context';
import { logoutUser } from "../../services/auth.service";
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);
    const navigate = useNavigate();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [hasLoggedIn, setHasLoggedIn] = useState(false);

    const logout = () => {
        logoutUser()
            .then(() => {
                setAppState({ user: null, userData: null });
                setIsDropdownVisible(false);
                navigate('/login');
            })
            .catch((error) => {
                console.error('Logout failed', error);
            });
    };

    const handleMouseEnter = () => {
        if (!hasLoggedIn) {
            setIsDropdownVisible(true);
        }
    };

    const handleMouseLeave = () => setIsDropdownVisible(false);

    useEffect(() => {
        if (user) {
            setHasLoggedIn(true);
            setTimeout(() => setHasLoggedIn(false), 500);
        } else {
            setHasLoggedIn(false);
        }
        setIsDropdownVisible(false);
    }, [user]);

    return (
        <header className="header">
            <nav>
                <div className="nav-links">
                    <NavLink to="/recipes" className="nav-navlink">Recipes</NavLink>
                    <NavLink to="/discussions" className="nav-navlink">Discussions</NavLink>
                </div>

                <div className="logo">
                    <NavLink to="/">
                        <img src={logo} alt="Flavor Fusion Logo" />
                    </NavLink>
                </div>

                {user ? (
                    <div className="user-section">
                        <NavLink to="/create-recipe" className="nav-navlink">Create Recipe</NavLink>
                        <p className="welcome-message">Welcome, {userData?.handle}</p>
                        <div
                            className="profile-picture-wrapper"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                src={userData?.photoURL || defaultProfilePic}
                                alt="User Profile"
                                className="profile-picture"
                            />
                            {isDropdownVisible && (
                                <div className="dropdown-menu">
                                    <button className="dropdown-button" onClick={() => navigate('/profile')}>Profile</button>
                                    <button className="dropdown-button" onClick={() => navigate('/favorites')}>Favorites</button>
                                    <button className="dropdown-button logout" onClick={logout}>Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="auth-navlinks">
                        <NavLink to="/register" className="nav-navlink">Register</NavLink>
                        <NavLink to="/login" className="nav-navlink">Login</NavLink>
                    </div>
                )}
            </nav>
        </header>
    );
}
