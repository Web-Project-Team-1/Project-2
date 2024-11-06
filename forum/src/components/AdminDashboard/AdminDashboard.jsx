// User registration and authentication code remains unchanged

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
            const usersArray = data
                ? Object.keys(data).map((handle) => ({
                    handle,
                    ...data[handle],
                }))
                : [];
            setUsers(usersArray);
        });
    }, []);

    const promoteToAdmin = async (handle) => {
        const db = getDatabase();
        const userRef = ref(db, `users/${handle}`);

        try {
            await update(userRef, { isAdmin: true });
            console.log(`User ${handle} promoted to admin.`);
        } catch (error) {
            console.error("Error promoting user to admin:", error);
        }
    };

    const deleteUser = async (handle) => {
        const db = getDatabase();
        const userRef = ref(db, `users/${handle}`);

        try {
            await remove(userRef);
            console.log(`User ${handle} deleted.`);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const blockUser = async (handle) => {
        const db = getDatabase();
        const userRef = ref(db, `users/${handle}`);

        try {
            await update(userRef, { isBlocked: true });
            console.log(`User ${handle} blocked.`);
        } catch (error) {
            console.error("Error blocking user:", error);
        }
    };

    const unblockUser = async (handle) => {
        const db = getDatabase();
        const userRef = ref(db, `users/${handle}`);

        try {
            await update(userRef, { isBlocked: false });
            console.log(`User ${handle} unblocked.`);
        } catch (error) {
            console.error("Error unblocking user:", error);
        }
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <ul className="user-list">
                {users.map((user) => (
                    <li key={user.handle} className="user-item">
                        <span>{user.email}</span>
                        <div>
                            {user.isAdmin ? (
                                <span> - Admin</span>
                            ) : (
                                <button
                                    className="promote-button"
                                    onClick={() => promoteToAdmin(user.handle)}
                                >
                                    Promote to Admin
                                </button>
                            )}
                            {user.isBlocked ? (
                                <button
                                    className="unblock-button"
                                    onClick={() => unblockUser(user.handle)}
                                >
                                    Unblock User
                                </button>
                            ) : (
                                <button
                                    className="block-button"
                                    onClick={() => blockUser(user.handle)}
                                >
                                    Block User
                                </button>
                            )}
                            <button
                                className="delete-button"
                                onClick={() => deleteUser(user.handle)}
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
