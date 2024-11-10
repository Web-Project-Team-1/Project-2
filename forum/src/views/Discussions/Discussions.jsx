import React, { useState, useEffect, useContext } from 'react';
import { getAllDiscussions } from '../../services/discussions.service';
import { AppContext } from '../../store/app.context';
import CreateDiscussionModal from '../../components/Discussions/CreateDiscussionModal';
import DiscussionModal from '../../components/Discussions/DiscussionModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Discussions.css';
import { Filter } from 'bad-words';

const Discussions = () => {
    const { user, userData } = useContext(AppContext);
    const [discussions, setDiscussions] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);
    const [isDiscussionModalOpen, setIsDiscussionModalOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [discussionsPerPage] = useState(12);

    const filter = new Filter();

    useEffect(() => {
        const fetchDiscussions = async () => {
            try {
                const data = await getAllDiscussions();
                const censoredDiscussions = data.map(discussion => ({
                    ...discussion,
                    title: filter.clean(discussion.title),
                    content: filter.clean(discussion.content),
                }));
                setDiscussions(censoredDiscussions);
            } catch (error) {
                console.error("Error fetching discussions:", error);
            }
        };
        fetchDiscussions();
    }, []);

    const handleDiscussionCreated = (newDiscussion) => {
        const censoredDiscussion = {
            ...newDiscussion,
            title: filter.clean(newDiscussion.title),
            content: filter.clean(newDiscussion.content),
        };

        setDiscussions((prevDiscussions) => [...prevDiscussions, censoredDiscussion]);
        toast.success("Discussion successfully created!");
    };

    const handleDiscussionDeleted = (discussionId) => {
        setDiscussions((prevDiscussions) =>
            prevDiscussions.filter((discussion) => discussion.id !== discussionId)
        );
        toast.success("Discussion successfully deleted.");
    };

    const openDiscussionModal = (discussion) => {
        setSelectedDiscussion(discussion);
        setIsDiscussionModalOpen(true);
    };

    const indexOfLastDiscussion = currentPage * discussionsPerPage;
    const indexOfFirstDiscussion = indexOfLastDiscussion - discussionsPerPage;
    const currentDiscussions = discussions.slice(indexOfFirstDiscussion, indexOfLastDiscussion);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(discussions.length / discussionsPerPage);

    return (
        <div className="discussions-background">
            <div className="discussions-page">
                <h2>Discussions</h2>
                <button className="create-discussion-button" onClick={() => setIsCreateModalOpen(true)}>+</button>

                {isCreateModalOpen && (
                    <CreateDiscussionModal
                        onClose={() => setIsCreateModalOpen(false)}
                        onDiscussionCreated={handleDiscussionCreated}
                    />
                )}

                {isDiscussionModalOpen && (
                    <DiscussionModal
                        discussion={selectedDiscussion}
                        onClose={() => setIsDiscussionModalOpen(false)}
                        user={user}
                        userData={userData}
                        onDiscussionDeleted={handleDiscussionDeleted}
                    />
                )}

                <div className="discussion-list">
                    {currentDiscussions.map(discussion => (
                        <div
                            key={discussion.id}
                            className="discussion-item"
                            onClick={() => openDiscussionModal(discussion)}
                        >
                            <h3>{discussion.title}</h3>
                            <p><small>Created by {discussion.createdBy} on {new Date(discussion.createdOn).toLocaleString()}</small></p>
                        </div>
                    ))}
                </div>

                <div className="pagination">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>

                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    progressStyle={{ background: "green" }}
                />
            </div>
        </div>
    );
};

export default Discussions;
