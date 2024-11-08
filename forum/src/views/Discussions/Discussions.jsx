import React, { useState, useEffect, useContext } from 'react';
import { getAllDiscussions } from '../../services/discussions.service';
import { AppContext } from '../../store/app.context';
import CreateDiscussionModal from '../../components/Discussions/CreateDiscussionModal';
import DiscussionModal from '../../components/Discussions/DiscussionModal';
import './Discussions.css';

const Discussions = () => {
    const { user, userData } = useContext(AppContext);
    const [discussions, setDiscussions] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);
    const [isDiscussionModalOpen, setIsDiscussionModalOpen] = useState(false);

    useEffect(() => {
        const fetchDiscussions = async () => {
            try {
                const data = await getAllDiscussions();
                setDiscussions(data);
            } catch (error) {
                console.error("Error fetching discussions:", error);
            }
        };
        fetchDiscussions();
    }, []);

    const openDiscussionModal = (discussion) => {
        setSelectedDiscussion(discussion);
        setIsDiscussionModalOpen(true);
    };

    return (
        <div className="discussions-background">
            <div className="discussions-page">
                <h2>Discussions</h2>
                <button className="create-discussion-button" onClick={() => setIsCreateModalOpen(true)}>+</button>
                {isCreateModalOpen && <CreateDiscussionModal onClose={() => setIsCreateModalOpen(false)} />}
                {isDiscussionModalOpen && <DiscussionModal discussion={selectedDiscussion} onClose={() => setIsDiscussionModalOpen(false)} user={user} userData={userData} />}
                <div className="discussion-list">
                    {discussions.map(discussion => (
                        <div key={discussion.id} className="discussion-item" onClick={() => openDiscussionModal(discussion)}>
                            <h3>{discussion.title}</h3>
                            <p><small>Created by {discussion.createdBy} on {new Date(discussion.createdOn).toLocaleString()}</small></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Discussions;
