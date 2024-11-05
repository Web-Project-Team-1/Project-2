import React, { useState, useEffect } from 'react';
import { addReply, getReplies } from '../../services/discussions.service';
import './DiscussionModal.css';

const DiscussionModal = ({ onClose, discussion, user }) => {
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');

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

        const replyData = {
            content: newReply,
            createdBy: user.displayName || user.email.split("@")[0],
            createdOn: new Date().toISOString(),
        };

        try {
            await addReply(discussion.id, replyData);
            setReplies([...replies, replyData]);
            setNewReply('');
        } catch (error) {
            console.error("Error adding reply:", error);
        }
    };

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

                <button className="typklas" style={{ backgroundColor: "red" }} onClick={onClose}>Close</button>

            </div>
        </div>
    );
};

export default DiscussionModal;
