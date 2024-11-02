import React, { useState, useContext } from 'react';
import './Recipe.css';
import { AppContext } from '../../store/app.context';
import { likeRecipe, addToFavorites } from '../../services/recipes.service';
import CommentModal from './CommentModal';

const Recipe = ({ id, title, description }) => {
    const { user } = useContext(AppContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);

    const handleToggleModal = () => setIsExpanded(prev => !prev);

    const handleLike = async () => {
        if (!user) return alert("You must be logged in to like a recipe.");

        try {
            await likeRecipe(id, user.uid);
            setLikes(isLiked ? likes - 1 : likes + 1);
            setIsLiked(prev => !prev);
        } catch (error) {
            console.error("Error liking recipe:", error);
        }
    };

    const handleAddToFavorites = async () => {
        if (!user) return alert("You must be logged in to add to favorites.");

        try {
            await addToFavorites(id, user.uid);
            alert("Added to favorites!");
        } catch (error) {
            console.error("Error adding to favorites:", error);
        }
    };

    return (
        <>
            <div className="recipe-card" onClick={handleToggleModal}>
                <h3 className={`recipe-title ${isExpanded ? 'active' : ''}`}>{title}</h3>
            </div>

            {isExpanded && (
                <div className="modal-overlay" onClick={handleToggleModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="recipe-buttons">
                            <button className="recipe-button like" onClick={handleLike}>
                                {isLiked ? "Unlike" : "Like"} ({likes})
                            </button>
                            <button className="recipe-button favorite" onClick={handleAddToFavorites}>
                                Add to Favorites
                            </button>
                            <button className="recipe-button comment" onClick={() => setShowCommentModal(true)}>
                                Comment
                            </button>
                        </div>

                        <h2 className="modal-title">{title}</h2>
                        <p className="modal-description">{description}</p>
                        <button className="close-button" onClick={handleToggleModal}>Close</button>
                    </div>
                </div>
            )}

            {showCommentModal && (
                <CommentModal
                    onClose={() => setShowCommentModal(false)}
                    recipeId={id}
                    user={user}
                />
            )}
        </>
    );
};

export default Recipe;