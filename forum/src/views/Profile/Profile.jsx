import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../store/app.context';
import './Profile.css';

export default function Profile() {
    const { user, updateUser } = useContext(AppContext); 
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [profilePicture, setProfilePicture] = useState(user.photoURL || 'default-profile-pic.jpg');
    const [username, setUsername] = useState(user.displayName || 'Username');
    const [name, setName] = useState('');
    const [accountCreatedDate, setAccountCreatedDate] = useState('');
    const [postCount, setPostCount] = useState(0);

    useEffect(() => {
        setAccountCreatedDate(user.creationDate);
        setPostCount(user.postCount);
    }, [user]);

    const handleToggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
    };

    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const newPictureUrl = URL.createObjectURL(file);
            setProfilePicture(newPictureUrl);
        }
    };

    const handleSaveSettings = () => {
        const updatedUser = {
            ...user,
            displayName: username,
            photoURL: profilePicture,
            name
        };
        updateUser(updatedUser); 
        setIsSettingsOpen(false);
        alert('Profile settings saved successfully!');
    };
    

    return (
        <div className="profile-background">
            <div className="profile-page">
                <div className="profile-header">
                    <img src={profilePicture} alt="Profile" className="profile-picture" />
                    <h2 className="profile-username">{username}</h2>
                </div>

                <button onClick={handleToggleSettings} className="settings-button">
                    {isSettingsOpen ? 'Close Settings' : 'Open Settings'}
                </button>

                {isSettingsOpen && (
                    <div className="profile-settings">
                        <label>
                            Username:
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </label>

                        <label>
                            Change Profile Picture:
                            <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
                        </label>

                        <label>
                            Change Name:
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </label>

                        <button onClick={handleSaveSettings} className="save-button">Save Settings</button>
                    </div>
                )}

                <div className="profile-footer">
                    <p>Account Created: {accountCreatedDate}</p>
                    <p>Posts Created: {postCount}</p>
                </div>
            </div>
        </div>
    );
}
