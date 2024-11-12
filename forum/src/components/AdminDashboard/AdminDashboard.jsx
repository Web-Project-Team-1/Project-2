import React, { useEffect, useState, useContext } from "react";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import { AppContext } from "../../store/app.context";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { userData } = useContext(AppContext);

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
            setUsers((prev) => prev.map((user) => (user.handle === handle ? { ...user, isBlocked: true } : user)));
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
            setUsers((prev) => prev.map((user) => (user.handle === handle ? { ...user, isBlocked: false } : user)));
        } catch (error) {
            console.error("Error unblocking user:", error);
        }
    };

    const filteredUsers = users.filter((user) =>
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.handle && user.handle.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="board">
            <div className="admin-dashboard">
                <h1>Admin Dashboard</h1>
                <input
                    type="text"
                    placeholder="Search by username or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <ul className="user-list">
                    {filteredUsers.map((user) => (
                        <li key={user.handle} className="user-item">
                            <span className="user-email-text">
                                {user.email} {user.isBlocked && <span className="blocked-label">(Blocked)</span>}
                            </span>
                            <div className="user-status">
                                {user.isAdmin ? (
                                    <span className="admin-text">🔑 Admin</span>
                                ) : (
                                    <button className="promote-button" onClick={() => promoteToAdmin(user.handle)}>
                                        Promote to Admin
                                    </button>
                                )}
                            </div>
                            <div className="button-container">
                                <div className="user-buttons">
                                    {user.isBlocked ? (
                                        <button className="unblock-button" onClick={() => unblockUser(user.handle)}>
                                            Unblock User
                                        </button>
                                    ) : (
                                        <button className="block-button" onClick={() => blockUser(user.handle)}>
                                            Block User
                                        </button>
                                    )}
                                    <button className="delete-button" onClick={() => deleteUser(user.handle)}>
                                        Delete User
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
