import { useState, useContext } from "react";
import { AppContext } from "../../store/app.context";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import { createUserHandle, getUserByHandle } from "../../services/users.service";
import './Register.css';

export default function Register() {
    const [user, setUser] = useState({
        handle: '',
        email: '',
        password: ''
    });

    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const register = () => {
        if (!user.handle || !user.email || !user.password) {
            return alert('Please enter a username, email, and password');
        }

        getUserByHandle(user.handle)
            .then(userFromDB => {
                if (userFromDB) {
                    throw new Error(`User ${user.handle} already exists`);
                }
                return registerUser(user.email, user.password, user.handle);
            })
            .then(credential => {
                return createUserHandle(user.handle, credential.user.uid, user.email)
                    .then(() => {
                        setAppState({
                            user: {
                                uid: credential.user.uid,
                                email: user.email,
                                handle: user.handle,
                            },
                            userData: null,
                        });
                        navigate('/');
                    })
                    .catch(error => {
                        console.error('Register failed', error);
                    });
            })
            .catch(error => {
                alert(error.message);
            });
    };

    const updateUser = (prop) => (e) => {
        setUser({
            ...user,
            [prop]: e.target.value
        });
    };

    return (
        <div className="register-background">
            <div className="register">
                <div className="register-container">
                    <h1>Register</h1>
                    <label htmlFor="handle">Username: </label>
                    <input value={user.handle} onChange={updateUser('handle')} type="text" id="handle" />
                    <br /><br />
                    <label htmlFor="email">Email: </label>
                    <input value={user.email} onChange={updateUser('email')} type="text" id="email" />
                    <br /><br />
                    <label htmlFor="password">Password: </label>
                    <input value={user.password} onChange={updateUser('password')} type="password" id="password" />
                    <button onClick={register}>Register</button>
                    <div className="footer">
                        Already have an account? <a href="/login">Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
