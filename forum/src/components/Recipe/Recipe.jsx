import React, { useState, useEffect, useContext } from 'react';
import './Recipe.css';
import { AppContext } from '../../store/app.context';
import { likeRecipe, addToFavorites, getRecipeLikes } from '../../services/recipes.service';
import CommentModal from './CommentModal';

const Recipe = ({ id, title, description, image }) => {
    const { user } = useContext(AppContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);

    useEffect(() => {
        const fetchLikes = async () => {
            if (user) {
                try {
                    const { likeCount, userLiked } = await getRecipeLikes(id, user.uid);
                    setLikes(likeCount);
                    setIsLiked(userLiked);
                } catch (error) {
                    console.error("Error fetching like data:", error);
                }
            }
        };

        fetchLikes();
    }, [id, user]);

    const openModal = () => setIsExpanded(true);
    const closeModal = () => setIsExpanded(false);

    const handleLike = async () => {
        if (!user) {
            alert("You must be logged in to like a recipe.");
            return;
        }

        try {
            const liked = await likeRecipe(id, user.uid);
            setLikes(liked ? likes + 1 : likes - 1);
            setIsLiked(liked);
        } catch (error) {
            console.error("Error liking recipe:", error);
        }
    };

    const handleAddToFavorites = async () => {
        if (!user) {
            alert("You must be logged in to add to favorites.");
            return;
        }

        try {
            await addToFavorites(id, user.uid);
            alert("Added to favorites!");
        } catch (error) {
            console.error("Error adding to favorites:", error);
        }
    };

    const handleComment = () => setShowCommentModal(true);

    return (
        <>
            <div className="recipe-card" onClick={openModal}>
                <h3 className={`recipe-title`}>{title}</h3>
                {image ? (
                    <img src={image} alt={title} className="recipe-image" />
                ) : (
                    <p>No image available</p>
                )}
                {user && (
                    <div className="recipe-user">
                        <span className="user-username">Created from: <br /> {user.email.split("@")[0]}</span>
                    </div>
                )}
            </div>

            {isExpanded && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="recipe-buttons">
                            <button className={`recipe-button like`} onClick={handleLike}>
                                {isLiked ? "Unlike" : "Like"} ({likes})
                            </button>
                            <button className={`recipe-button favorite`} onClick={handleAddToFavorites}>
                                Add to Favorites
                            </button>
                            <button className={`recipe-button comment`} onClick={handleComment}>
                                Comment
                            </button>
                        </div>

                        <h2 className="modal-title">{title}</h2>
                        {image ? (
                            <img src={image} alt={title} className="modal-image" />
                        ) : (
                            <p>No image available</p>
                        )}
                        <p className="modal-description">{description}</p>
                        {user && (
                            <div className="modal-user">
                                <span className="user-username">{user.username}</span>
                            </div>
                        )}
                        <button className="close-button" onClick={closeModal}>Close</button>
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