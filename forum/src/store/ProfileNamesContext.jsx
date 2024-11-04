import React, { createContext, useState } from 'react';

export const ProfileNamesContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [user, setUser] = useState({
        uid: null,
        email: null,
        handle: null,
        firstName: '',
        lastName: '',
    });
    const [userData, setUserData] = useState(null);

    const updateUser = (updatedUser) => {
        setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
    };

    return (
        <ProfileNamesContext.Provider value={{ user, userData, setUser, updateUser }}>
            {children}
        </ProfileNamesContext.Provider>
    );
};
