import { ref, push, get, set, remove } from "firebase/database";
import { db } from "../config/firebase-config";

export const createDiscussion = async (title, content, creatorUsername) => {
    const newDiscussionRef = push(ref(db, 'discussions'));
    const id = newDiscussionRef.key;
    const creationDate = new Date().toISOString();

    const discussion = { 
        id, 
        title, 
        content, 
        createdOn: new Date().toString(),
        createdBy: creatorUsername,
        creationDate,
    };

    try {
        await set(newDiscussionRef, discussion);
        return id; 
    } catch (error) {
        console.error('Error creating discussion:', error);
        throw error; 
    }
};

export const getAllDiscussions = async () => {
    try {
        const snapshot = await get(ref(db, 'discussions'));
        if (snapshot.exists()) {
            return Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching discussions:", error);
        throw error;
    }
};

export const addReply = async (discussionId, replyData) => {
    const replyRef = ref(db, `discussions/${discussionId}/replies`);
    const newReplyRef = push(replyRef);
    await set(newReplyRef, replyData);

    return newReplyRef;
};

export const getReplies = async (discussionId) => {
    const snapshot = await get(ref(db, `discussions/${discussionId}/replies`));
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

export const deleteDiscussion = async (discussionId) => {
    try {
        const discussionRef = ref(db, `discussions/${discussionId}`);
        await remove(discussionRef);
    } catch (error) {
        console.error("Error deleting discussion:", error);
        throw error;
    }
};

export const deleteReply = async (discussionId, replyId) => {
    try {
        const replyRef = ref(db, `discussions/${discussionId}/replies/${replyId}`);
        await remove(replyRef);
    } catch (error) {
        console.error("Error deleting reply:", error);
        throw error;
    }
};
