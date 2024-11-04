import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../../store/app.context';
import { ProfileNamesContext } from '../../store/ProfileNamesContext';
import { uploadProfilePicture, updateUserNames } from '../../services/users.service';
import './Profile.css';

export default function Profile() {
    const { user, userData } = useContext(AppContext); 
    const { setUser, updateUser } = useContext(ProfileNamesContext);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePicture, setProfilePicture] = useState('default-profile-pic.jpg');
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user && userData) {
            setProfilePicture(userData.photoURL || 'default-profile-pic.jpg');
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
            setLoading(false);
        }
    }, [user, userData]);

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

    const handleNamesChange = async () => {
        try {
            const handle = user.email.split('@')[0];
            await updateUserNames(user.uid, handle, firstName, lastName);
            setUser({ ...user, firstName, lastName, displayName: `${firstName} ${lastName}` });
        } catch (error) {
            console.error("Error updating names:", error);
        }
    };

    const handleSaveSettings = async () => {
        if (!validateFirstName(firstName) || !validateLastName(lastName)) {
            return; // Exit if validation fails
        }

        try {
            const updatedUser = {
                ...user,
                displayName: `${firstName} ${lastName}`,
                photoURL: profilePicture,
            };

            await updateUser(updatedUser);
            await handleNamesChange();

            setIsSettingsOpen(false);
            alert('Profile settings saved successfully!');
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings. Please try again.");
        }
    };

    const validateFirstName = (name) => {
        if (name.length < 3) {
            alert('First name must be at least 3 characters long.');
            return false;
        } else if (name.length > 42) {
            alert('First name cannot exceed 42 characters.');
            return false;
        }
        return true;
    };

    const validateLastName = (name) => {
        if (name.length < 3) {
            alert('Last name must be at least 3 characters long.');
            return false;
        } else if (name.length > 42) {
            alert('Last name cannot exceed 42 characters.');
            return false;
        }
        return true;
    };

    if (loading) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="profile-background">
            <div className="profile-page">
                <div className="profile-header">
                    <div className="profile-picture-container">
                        <img src={profilePicture} alt="Profile" className="profile-picture" onClick={handleProfilePictureClick} style={{ cursor: 'pointer' }} />
                        <span className="profile-picture-hover-text">Change Profile Picture</span>
                    </div>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleProfilePictureChange} style={{ display: 'none' }} />
                    <h2 className="profile-name">{firstName} {lastName}</h2>
                </div>

                <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="settings-button">
                    {isSettingsOpen ? 'Close Settings' : 'Open Settings'}
                </button>

                {isSettingsOpen && (
                    <div className="profile-settings">
                        <label htmlFor="firstName">First Name:
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
                        </label>
                        <label htmlFor="lastName">Last Name:
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
                        </label>
                        <button onClick={handleSaveSettings} className="save-button">Save Settings</button>
                    </div>
                )}

                <div className="profile-footer">
                    <p>Account Created: {userData?.createdOn || 'Unknown'}</p>
                </div>
            </div>
        </div>
    );
}
