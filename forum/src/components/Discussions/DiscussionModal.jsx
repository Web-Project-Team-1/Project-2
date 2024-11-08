import React, { useState, useEffect } from 'react';
import { addReply, getReplies, deleteReply, deleteDiscussion } from '../../services/discussions.service';
import './DiscussionModal.css';

const DiscussionModal = ({ onClose, discussion, user, userData }) => {
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [replyToDelete, setReplyToDelete] = useState(null);

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
        if (user.isBlocked) {
            alert("You are currently blocked.");
            return;
        }

        if (!user) {
            alert("You must be logged in to reply.");
            return;
        }

        const replyData = {
            content: newReply,
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

    const handleDeleteReply = async () => {
        if (replyToDelete) {
            if (window.confirm("Are you sure you want to delete this reply?")) {
                try {
                    await deleteReply(discussion.id, replyToDelete.id);
                    setReplies(replies.filter(r => r.id !== replyToDelete.id));
                    setReplyToDelete(null);
                } catch (error) {
                    console.error("Error deleting reply:", error);
                }
            }
        }
    };

    const handleDeleteDiscussion = async () => {
        if (window.confirm("Are you sure you want to delete this discussion? This action cannot be undone.")) {
            try {
                await deleteDiscussion(discussion.id);
                onClose();
            } catch (error) {
                console.error("Error deleting discussion:", error);
            }
        }
    };

    const isUserCreator = discussion.createdBy === (userData.handle || user.email.split("@")[0]);

    return (
        <div className="discussion-modal-overlay" onClick={onClose}>
            <div className="discussion-modal-container" onClick={(e) => e.stopPropagation()}>
                <label className="discussion-label" htmlFor="discussion-title">Title:</label>
                <h2 className="discussion-title" id="discussion-title">{discussion.title}</h2>

                <label className="discussion-label" htmlFor="discussion-content">Content:</label>
                <p className="discussion-content" id="discussion-content">{discussion.content}</p>
                <p className="discussion-meta"><small>Created by {discussion.createdBy} on {new Date(discussion.createdOn).toLocaleString()}</small></p>

                <h3 className="replies-title">Replies</h3>
                <div className="replies-list">
                    {replies.length > 0 ? (
                        replies.map((reply, index) => (
                            <div key={index} className="reply-item">
                                <p><strong>{reply.createdBy}</strong> on {new Date(reply.createdOn).toLocaleString()}</p>
                                <p>{reply.content}</p>
                                {reply.createdBy === (user.displayName || user.email.split("@")[0]) && (
                                    <button
                                        onClick={() => setReplyToDelete(reply)}
                                        className="delete-reply-button">
                                        Select to Delete
                                    </button>
                                )}
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

                <button
                    className={`delete-discussion-button ${isUserCreator ? '' : 'disabled'}`}
                    onClick={isUserCreator ? handleDeleteDiscussion : null}
                    disabled={!isUserCreator}
                    title={isUserCreator ? '' : 'Only the creator can delete this discussion'}>
                    Delete Discussion
                </button>
            </div>
        </div>
    );
};

export default DiscussionModal;
