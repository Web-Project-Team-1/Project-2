import React, { createContext, useState, useEffect } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";

export const BlockAsAdminContext = createContext({
  users: [],
  blockUser: () => {},
  unblockUser: () => {},
});

export const BlockAsAdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const usersArray = data
        ? Object.keys(data).map((handle) => ({
            handle,
            ...data[handle],
          }))
        : [];
      setUsers(usersArray);
    });

    return () => unsubscribe();
  }, []);

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

  return (
    <BlockAsAdminContext.Provider value={{ users, blockUser, unblockUser }}>
      {children}
    </BlockAsAdminContext.Provider>
  );
};
