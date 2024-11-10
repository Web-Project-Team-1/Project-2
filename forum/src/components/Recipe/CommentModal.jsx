import React, { useState, useEffect } from 'react';
import { addComment, getComments } from '../../services/recipes.service';
import { Filter } from 'bad-words';
import './CommentModal.css';

const CommentModal = ({ onClose, recipeId, userData }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const filter = new Filter();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const fetchedComments = await getComments(recipeId);
                const censoredComments = fetchedComments.map(comment => ({
                    ...comment,
                    content: filter.clean(comment.content),
                }));
                setComments(censoredComments || []);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchComments();
    }, [recipeId]);

    const handleAddComment = async () => {
        if (!userData) {
            alert("You must be logged in to comment.");
            return;
        }

        if (userData.isBlocked) {
            alert("You are currently blocked from commenting.");
            return;
        }

        const censoredComment = filter.clean(newComment);

        const commentData = {
            author: userData.handle || 'Anonymous',
            date: new Date().toString(),
            content: censoredComment,
        };

        try {
            await addComment(recipeId, commentData);
            setComments([...comments, commentData]);
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
                                <p>
                                    <strong>{comment.author}</strong> on {new Date(comment.date).toLocaleString()}
                                </p>
                                <p>{comment.content}</p>
                            </div>
                        ))
                    ) : (
                        <p>No comments yet. Be the first to comment!</p>
                    )}
                </div>

                <div className="add-comment">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your comment here..."
                        autoComplete="off"
                    />
                    <button onClick={handleAddComment}>Add Comment</button>
                </div>

                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default CommentModal;
