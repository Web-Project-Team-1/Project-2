import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../store/app.context";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.service";
import { getUserData } from "../../services/users.service";
import './Login.css';

export default function Login() {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [redirectToProfile, setRedirectToProfile] = useState(false);

    const { setAppState, userData } = useContext(AppContext);
    const navigate = useNavigate();

    const login = async () => {
        if (!credentials.email || !credentials.password) {
            return alert('Please enter both email and password');
        }

        try {
            const credential = await loginUser(credentials.email, credentials.password);
            const uid = credential.user.uid;
            const fetchedUserData = await getUserData(uid);

            setAppState({ user: credential.user, userData: fetchedUserData });

            setRedirectToProfile(true);
        } catch (error) {
            console.error('Login failed', error);
            alert("Failed to login. Please check your credentials.");
        }
    };

    const updateCredentials = (prop) => (e) => {
        setCredentials({
            ...credentials,
            [prop]: e.target.value
        });
    };

    useEffect(() => {
        if (redirectToProfile && userData) {
            navigate('/profile');
        }
    }, [redirectToProfile, userData, navigate]);

    return (
        <div className="login-page">
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
        </div>
    );
}
