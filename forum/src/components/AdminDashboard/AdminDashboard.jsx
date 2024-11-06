import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const db = getDatabase();
        const usersRef = ref(db, "users");

        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            const usersArray = data ? Object.values(data) : [];
            setUsers(usersArray);
        });
    }, []);

    const promoteToAdmin = (uid) => {
        const db = getDatabase();
        const userRef = ref(db, `users/${uid}`);
        update(userRef, { isAdmin: true });
    };

    const deleteUser = (uid) => {
        const db = getDatabase();
        const userRef = ref(db, `users/${uid}`);
        remove(userRef);
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <ul className="user-list">
                {users.map((user) => (
                    <li key={user.uid} className="user-item">
                        <span>{user.email}</span>
                        <div>
                            {user.isAdmin ? (
                                <span> - Admin</span>
                            ) : (
                                <button
                                    className="promote-button"
                                    onClick={() => promoteToAdmin(user.uid)}
                                >
                                    Promote to Admin
                                </button>
                            )}
                            <button
                                className="delete-button"
                                onClick={() => deleteUser(user.uid)}
                            >
                                Delete User
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;
