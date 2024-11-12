import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Recipe.css';
import { AppContext } from '../../store/app.context';
import { FavoritesContext } from '../../store/FavoritesContext';
import { likeRecipe, getRecipeLikes, deleteRecipe, getCommentCount } from '../../services/recipes.service';
import CommentModal from './CommentModal';
import { toast } from 'react-toastify';

const Recipe = ({ id, title, description, image, preparationTime, portions, ingredients, creatorHandle, creationDate, onEdit, onDelete }) => {
    const { user, userData } = useContext(AppContext);
    const { favorites, addToFavorites, removeFromFavorites } = useContext(FavoritesContext);
    const navigate = useNavigate();

    const [isExpanded, setIsExpanded] = useState(false);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [showMoreInfo, setShowMoreInfo] = useState(false);

    const isFavorited = favorites.includes(id);
    const isCreator = user && userData?.handle === creatorHandle;
    const isAdmin = userData?.isAdmin;

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

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

        const fetchCommentCount = async () => {
            try {
                const count = await getCommentCount(id);
                setCommentCount(count);
            } catch (error) {
                console.error("Error fetching comment count:", error);
            }
        };

        fetchLikes();
        fetchCommentCount();
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

    const handleToggleFavorite = async () => {
        if (!user) {
            alert("You must be logged in to add to favorites.");
            return;
        }

        try {
            if (isFavorited) {
                await removeFromFavorites(id, user.uid);
            } else {
                await addToFavorites(id, user.uid);
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    const handleComment = () => {
        if (!user) {
            alert("You must be logged in to comment on a recipe.");
            return;
        }

        if (userData?.isBlocked) {
            alert('You are blocked and cannot comment on recipes.');
            return;
        }

        setShowCommentModal(true);
    };

    const incrementCommentCount = () => {
        setCommentCount(commentCount + 1);
    };

    const handleDelete = () => {
        setIsConfirmDeleteOpen(true);
    };

    const confirmDeleteRecipe = async () => {
        if (isAdmin || isCreator) {
            try {
                await deleteRecipe(id);
                if (onDelete) onDelete(id);
                navigate('/recipes');
                toast.success('Recipe deleted successfully!');
            } catch (error) {
                console.error("Error deleting recipe:", error);
                toast.error("Failed to delete the recipe. Please try again.");
            } finally {
                setIsConfirmDeleteOpen(false);
            }
        } else {
            alert("You do not have permission to delete this recipe.");
        }
    };

    const cancelDeleteRecipe = () => {
        setIsConfirmDeleteOpen(false);
    };

    const toggleMoreInfo = () => setShowMoreInfo(!showMoreInfo);

    return (
        <>
            <div className="recipe-card" onClick={openModal}>
                <h3 className="recipe-title">{title}</h3>
                {image ? (
                    <img src={image} alt={title} className="recipe-image" />
                ) : (
                    <p>No image available</p>
                )}
            </div>

            {isExpanded && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">{title}</h2>
                        {image ? (
                            <img src={image} alt={title} className="modal-image" />
                        ) : (
                            <p>No image available</p>
                        )}
                        <p className="modal-description">{description}</p>

                        <div className="modal-user">
                            <span className="user-username">
                                Created by: {creatorHandle || "Unknown"}
                            </span>
                            <br />
                            <span className="recipe-date">
                                Created on: {formatDate(creationDate)}
                            </span>
                        </div>

                        <div className="modal-details">
                            <button onClick={toggleMoreInfo} className="show-more-button">
                                {showMoreInfo ? "Show Less" : "Show More Information"}
                            </button>

                            {showMoreInfo && (
                                <div className="additional-info">
                                    <p>Preparation Time: {preparationTime ? preparationTime : "undefined"} mins</p>
                                    <p>Portions: {portions}</p>
                                    <p>Ingredients: {ingredients}</p>
                                </div>
                            )}
                        </div>

                        <div className="recipe-buttons">
                            <button
                                className={`recipe-button like ${!user ? 'disabled' : ''}`}
                                onClick={user ? handleLike : (e) => e.preventDefault()}
                                title={!user ? "Please log in to like the recipe." : ""}
                            >
                                {isLiked ? "Unlike" : "Like"} ➾{likes}
                            </button>

                            <button
                                className={`recipe-button favorite ${!user ? 'disabled' : ''}`}
                                onClick={user ? handleToggleFavorite : (e) => e.preventDefault()}
                                title={!user ? "Please log in to add the recipe to favorites." : ""}
                            >
                                {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                            </button>

                            <button
                                className={`recipe-button comment ${!user ? 'disabled' : ''}`}
                                onClick={user ? handleComment : (e) => e.preventDefault()}
                                title={!user ? "Please log in to comment on the recipe." : ""}
                            >
                                Comment ➾{commentCount}
                            </button>

                            <button
                                className={`recipe-button edit ${isAdmin || isCreator ? '' : 'disabled'}`}
                                onClick={isAdmin || isCreator ? onEdit : (e) => e.preventDefault()}
                                title={!isAdmin && !isCreator ? "Only the creator or admin can edit." : ""}
                            >
                                Edit
                            </button>

                            <button
                                className={`recipe-button delete ${isAdmin || isCreator ? '' : 'disabled'}`}
                                onClick={handleDelete}
                                title={!isAdmin && !isCreator ? "Only the creator or admin can delete." : ""}
                            >
                                Delete
                            </button>
                        </div>

                        <button className="close-button" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}

            {showCommentModal && (
                <CommentModal
                    onClose={() => setShowCommentModal(false)}
                    recipeId={id}
                    userData={userData}
                    onCommentAdded={incrementCommentCount}
                />
            )}

            {isConfirmDeleteOpen && (
                <div className="confirmation-modal-overlay" onClick={cancelDeleteRecipe}>
                    <div className="confirmation-modal-container" onClick={(e) => e.stopPropagation()}>
                        <h3>Are you sure you want to delete this recipe?</h3>
                        <div className="confirmation-buttons">
                            <button onClick={confirmDeleteRecipe} className="confirm-button">Yes, Delete</button>
                            <button onClick={cancelDeleteRecipe} className="cancel-button">No, Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Recipe;
