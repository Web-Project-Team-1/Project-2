import React, { useState, useContext } from "react";
import { createDiscussion } from "../../services/discussions.service";
import { AppContext } from "../../store/app.context";
import "./CreateDiscussionModal.css";

const CreateDiscussionModal = ({ onClose, onDiscussionCreated }) => {
    const { user, userData } = useContext(AppContext);
    const [discussion, setDiscussion] = useState({
        title: '',
        content: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateDiscussion = (key, value) => {
        setDiscussion(prev => ({ ...prev, [key]: value }));
    };

    const handleInput = (e) => {
        updateDiscussion('content', e.target.value);
        e.target.style.height = 'auto'; 
        e.target.style.height = `${e.target.scrollHeight}px`; 
    };

    const handleCreateDiscussion = async () => {
        const { title, content } = discussion;

        if (!title || !content) {
            alert('Please fill in all fields!');
            return;
        }

        if (!user || !userData?.handle) {
            alert('User is not logged in or username is missing.');
            return;
        }

        if (userData.isBlocked) {
            alert('You are blocked and cannot create discussions.');
            return;
        }

        setIsSubmitting(true);

        try {
            const discussionId = await createDiscussion(title, content, userData.handle);
            const newDiscussion = {
                id: discussionId,
                title,
                content,
                createdBy: userData.handle,
                createdOn: new Date().toISOString(),
            };

            onDiscussionCreated(newDiscussion); 
            onClose(); 
        } catch (error) {
            console.error('Failed to create discussion:', error);
            alert('Failed to create discussion!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-discussion-modal-overlay" onClick={onClose}>
            <div className="create-discussion-modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Create Discussion</h3>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        value={discussion.title}
                        onChange={e => updateDiscussion('title', e.target.value)}
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Enter discussion title"
                        autoComplete="off"
                    />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                        value={discussion.content}
                        onInput={handleInput} 
                        name="content"
                        id="content"
                        placeholder="Enter discussion content"
                        autoComplete="off"
                    />
                </div>
                <button onClick={handleCreateDiscussion} disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create"}
                </button>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default CreateDiscussionModal;
