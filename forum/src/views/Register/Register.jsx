import { useState, useContext } from "react";
import { AppContext } from "../../store/app.context";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import { createUserHandle, getUserByHandle } from "../../services/users.service";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
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
            return toast.warning('Please enter a username, email, and password', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                progressStyle: { backgroundColor: "#ffc107" },
            });
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

                        // toast.success('Registration successful!', {
                        //     position: "top-center",
                        //     autoClose: 3000,
                        //     hideProgressBar: false,
                        //     progressStyle: { backgroundColor: "#28a745" },
                        // });

                        setTimeout(() => navigate('/'));
                    })
                    .catch(error => {
                        console.error('Register failed', error);
                        toast.error('Failed to create user handle. Please try again.', {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            progressStyle: { backgroundColor: "#dc3545" },
                        });
                    });
            })
            .catch(error => {
                toast.error(error.message, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    progressStyle: { backgroundColor: "#dc3545" },
                });
            });
    };

    const updateUser = (prop) => (e) => {
        setUser({
            ...user,
            [prop]: e.target.value
        });
    };

    return (
        <div className="register-page">
            <div className="register-background">
                <div className="register">
                    <div className="register-container">
                        <h1>Register</h1>

                        <label htmlFor="handle">Username:</label>
                        <input
                            value={user.handle}
                            onChange={updateUser('handle')}
                            type="text"
                            id="handle"
                            autoComplete="off"
                        />
                        <br /><br />

                        <label htmlFor="email">Email:</label>
                        <input
                            value={user.email}
                            onChange={updateUser('email')}
                            type="text"
                            id="email"
                            autoComplete="off"
                        />
                        <br /><br />

                        <label htmlFor="password">Password:</label>
                        <input
                            value={user.password}
                            onChange={updateUser('password')}
                            type="password"
                            id="password"
                        />
                        <br /><br />

                        <button onClick={register}>Register</button>

                        <div className="footer">
                            Already have an account? <a href="/login">Login</a>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
