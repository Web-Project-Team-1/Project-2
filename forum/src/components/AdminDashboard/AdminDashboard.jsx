import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, set, remove, onValue } from "firebase/database";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const db = getDatabase();
        const usersRef = ref(db, "users");

        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            const usersArray = data
                ? Object.keys(data).map((key) => ({ uid: key, ...data[key] }))
                : [];
            setUsers(usersArray);
        });
    }, []);

    const promoteToAdmin = async (uid) => {
        const db = getDatabase();
        const userRef = ref(db, `users/${uid}`);

        try {
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                userData.isAdmin = true;

                await set(userRef, userData);
                console.log(`User ${uid} promoted to admin.`);
            } else {
                console.error("User data not found.");
            }
        } catch (error) {
            console.error("Error promoting user to admin:", error);
        }
    };

    const deleteUser = (uid) => {
        const db = getDatabase();
        const userRef = ref(db, `users/${uid}`);
        remove(userRef).catch((error) => {
            console.error("Error deleting user:", error);
        });
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <ul className="user-list">
                {users.map((user) => (
                    <li key={user.uid} className="user-item">
                        <span>{user.email}</span>
                        <div className="action-buttons">
                            {user.isAdmin ? (
                                <span className="admin-label"> - Admin</span>
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
