import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../../store/app.context';
import { uploadProfilePicture } from '../../services/users.service';
import './Profile.css';

export default function Profile() {
    const { user, userData, updateUser } = useContext(AppContext);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [profilePicture, setProfilePicture] = useState('default-profile-pic.jpg');
    const [username, setUsername] = useState('Username');
    const [name, setName] = useState('');
    const [accountCreatedDate, setAccountCreatedDate] = useState('');
    const [postCount, setPostCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Reference to the hidden file input
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user && userData) {
            setProfilePicture(userData.photoURL || 'default-profile-pic.jpg');
            setUsername(userData.displayName || 'Username');

            // Retrieve the actual creation date or set default text
            setAccountCreatedDate(userData.createdOn || 'Unknown');
            setPostCount(userData.postCount || 0);
            setLoading(false);
        }
    }, [user, userData]);

    const handleToggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
    };

    // Trigger the hidden file input when profile picture is clicked
    const handleProfilePictureClick = () => {
        fileInputRef.current.click();
    };

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const newPictureUrl = await uploadProfilePicture(file, user?.uid, userData.handle);
                setProfilePicture(newPictureUrl);
                updateUser({ ...user, photoURL: newPictureUrl });
            } catch (error) {
                console.error("Error uploading profile picture:", error);
                alert("Failed to upload profile picture. Please try again.");
            }
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

    if (loading) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="profile-background">
            <div className="profile-page">
                <div className="profile-header">
                    {/* Profile picture with click event and hover text */}
                    <div className="profile-picture-container">
                        <img
                            src={profilePicture}
                            alt="Profile"
                            className="profile-picture"
                            onClick={handleProfilePictureClick}
                            style={{ cursor: 'pointer' }}
                        />
                        <span className="profile-picture-hover-text">Change Profile Picture</span>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleProfilePictureChange}
                        style={{ display: 'none' }}
                    />

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
