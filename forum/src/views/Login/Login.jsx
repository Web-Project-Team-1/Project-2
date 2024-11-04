import { useState, useContext } from "react";
import { AppContext } from "../../store/app.context";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.service";
import './Login.css';

export default function Login() {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const login = () => {
        if (!credentials.email || !credentials.password) {
            return alert('Please enter both email and password');
        }

        loginUser(credentials.email, credentials.password)
            .then(credential => {
                navigate('/');
            })
            .catch(error => {
                console.error('Login failed', error);
            });
    };

    const updateCredentials = (prop) => (e) => {
        setCredentials({
            ...credentials,
            [prop]: e.target.value
        });
    };

    return (
        <div className="login-background">
            <div className="login">
                <div className="login-container">
                    <h1>Login</h1>
                    <label htmlFor="email">Email: </label>
                    <input value={credentials.email} onChange={updateCredentials('email')} type="text" id="email" />
                    <br /><br />
                    <label htmlFor="password">Password: </label>
                    <input value={credentials.password} onChange={updateCredentials('password')} type="password" id="password" />
                    <button onClick={login}>Login</button>
                    <div className="footer">
                        Don't have an account? <a href="/register">Register</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
