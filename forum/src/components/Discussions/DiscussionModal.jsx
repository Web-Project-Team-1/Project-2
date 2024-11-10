import React, { useState, useEffect } from 'react';
import { addReply, getReplies, deleteDiscussion } from '../../services/discussions.service';
import './DiscussionModal.css';
import { Filter } from 'bad-words';

const DiscussionModal = ({ onClose, discussion, user, userData, onDiscussionDeleted }) => {
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    useEffect(() => {
        const fetchReplies = async () => {
            if (discussion) {
                const fetchedReplies = await getReplies(discussion.id);
                setReplies(fetchedReplies || []);
            }
        };

        fetchReplies();
    }, [discussion]);

    const handleAddReply = async () => {
        if (!user) {
            alert("You must be logged in to reply.");
            return;
        }

        if (user.isBlocked) {
            alert("You are currently blocked.");
            return;
        }

        const filter = new Filter();

        const censoredReply = filter.clean(newReply);

        const replyData = {
            content: censoredReply,
            createdBy: userData?.handle || user.displayName,
            createdOn: new Date().toISOString(),
        };

        try {
            const replyRef = await addReply(discussion.id, replyData);
            const replyId = replyRef?.key || Date.now().toString();
            setReplies([...replies, { ...replyData, id: replyId }]);
            setNewReply('');
        } catch (error) {
            console.error("Error adding reply:", error);
        }
    };

    const handleDeleteDiscussion = () => {
        setIsConfirmDeleteOpen(true);
    };

    const confirmDeleteDiscussion = async () => {
        try {
            await deleteDiscussion(discussion.id);
            onDiscussionDeleted(discussion.id);
            onClose();
        } catch (error) {
            console.error("Error deleting discussion:", error);
        } finally {
            setIsConfirmDeleteOpen(false);
        }
    };

    const cancelDeleteDiscussion = () => {
        setIsConfirmDeleteOpen(false);
    };

    const isUserCreator = discussion.createdBy === (userData.handle || user.email.split("@")[0]);

    return (
        <div className="discussion-modal-overlay" onClick={onClose}>
            <div className="discussion-modal-container" onClick={(e) => e.stopPropagation()}>
                <label className="discussion-label" htmlFor="discussion-title">Title:</label>
                <h2 className="discussion-title" id="discussion-title">{discussion.title}</h2>

                <label className="discussion-label" htmlFor="discussion-content">Content:</label>
                <p className="discussion-content" id="discussion-content">{discussion.content}</p>
                <p className="discussion-meta">
                    <small>Created by {discussion.createdBy} on {new Date(discussion.createdOn).toLocaleString()}</small>
                </p>

                <h3 className="replies-title">Replies</h3>
                <div className="replies-list">
                    {replies.length > 0 ? (
                        replies.map((reply, index) => (
                            <div key={reply.id || index} className="reply-item">
                                <p><strong>{reply.createdBy}</strong> on {new Date(reply.createdOn).toLocaleString()}</p>
                                <p>{reply.content}</p>
                            </div>
                        ))
                    ) : (
                        <p>No replies yet. Be the first to reply!</p>
                    )}
                </div>

                <div className="add-reply-section">
                    <label className="reply-label" htmlFor="reply-input">Reply:</label>
                    <textarea
                        className="reply-textarea"
                        id="reply-input"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Write your reply here..."
                        autoComplete="off"
                    />
                    <button className="reply-button" onClick={handleAddReply}>Add Reply</button>
                </div>

                <button className="close-modal-button" onClick={onClose}>Close</button>

                {isUserCreator && (
                    <button
                        className="delete-discussion-button"
                        onClick={handleDeleteDiscussion}
                        title="Only the creator can delete this discussion">
                        Delete Discussion
                    </button>
                )}
            </div>

            {isConfirmDeleteOpen && (
                <div className="confirmation-modal-overlay" onClick={cancelDeleteDiscussion}>
                    <div className="confirmation-modal-container" onClick={(e) => e.stopPropagation()}>
                        <h3>Are you sure you want to delete this discussion?</h3>
                        <div className="confirmation-buttons">
                            <button onClick={confirmDeleteDiscussion} className="confirm-button">Yes, Delete</button>
                            <button onClick={cancelDeleteDiscussion} className="cancel-button">No, Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscussionModal;
