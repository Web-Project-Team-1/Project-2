import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../resources/fflogo.webp';

export default function Header() {
    return (
        <header className="header">
            <nav>
                <Link to="/recipes" className="nav-link">Recipes</Link>
                <div className="logo">
                    <Link to="/">
                        <img src={logo} alt="Flavor Fusion Logo" />
                    </Link>
                </div>
                <div className="auth-links">
                    <Link to="/register" className="nav-link">Register</Link>
                    <Link to="/login" className="nav-link">Login</Link>
                </div>
            </nav>
        </header>
    );
}