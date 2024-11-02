import React, { useState, useEffect } from 'react';
import { addComment, getComments } from '../../services/recipes.service';
import './CommentModal.css';

const CommentModal = ({ onClose, recipeId, user }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const fetchedComments = await getComments(recipeId);
                setComments(fetchedComments || []);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        })();
    }, [recipeId]);

    const handleAddComment = async () => {
        if (!user) return alert("You must be logged in to comment.");

        const commentData = {
            author: user.displayName,
            date: new Date().toString(),
            content: newComment,
        };

        try {
            await addComment(recipeId, commentData);
            setComments(prevComments => [...prevComments, commentData]);
            setNewComment('');
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Comments</h3>

                <div className="comments-list">
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={index} className="comment-item">
                                <p><strong>{comment.author}</strong> on {new Date(comment.date).toLocaleString()}</p>
                                <p>{comment.content}</p>
                            </div>
                        ))
                    ) : (
                        <p>No comments yet. Be the first to comment!</p>
                    )}
                </div>

                <div className="add-comment">
                    <label htmlFor="comment-input">Write your comment here:</label>
                    <textarea
                        id="comment-input"
                        name="comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your comment here..."
                        autocomplete="off"
                    />
                    <button onClick={handleAddComment} disabled={!newComment.trim()}>Add Comment</button>
                </div>

                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default CommentModal;
