import { useState } from "react";
import "./detail.css";
import { toast } from "react-toastify";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import Avatar from "../common/Avatar";

const Detail = ({ showDetail, setShowDetail }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } =
    useChatStore();

  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteChat = async () => {
    if (!chatId || !user) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this chat with ${user.username}? All messages will be permanently deleted.`
    );

    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      // Remove chat from current user's chat list
      const currentUserChatsRef = doc(db, "userchats", currentUser.id);
      const currentUserChatsSnap = await getDoc(currentUserChatsRef);

      if (currentUserChatsSnap.exists()) {
        const currentUserChats = currentUserChatsSnap.data().chats || [];
        const updatedCurrentUserChats = currentUserChats.filter(
          (chat) => chat.chatId !== chatId
        );
        await updateDoc(currentUserChatsRef, { chats: updatedCurrentUserChats });
      }

      // Remove chat from other user's chat list
      const otherUserChatsRef = doc(db, "userchats", user.id);
      const otherUserChatsSnap = await getDoc(otherUserChatsRef);

      if (otherUserChatsSnap.exists()) {
        const otherUserChats = otherUserChatsSnap.data().chats || [];
        const updatedOtherUserChats = otherUserChats.filter(
          (chat) => chat.chatId !== chatId
        );
        await updateDoc(otherUserChatsRef, { chats: updatedOtherUserChats });
      }

      // Delete the chat document
      await deleteDoc(doc(db, "chats", chatId));

      // Reset chat store and close detail panel
      resetChat();
      setShowDetail(false);

      toast.success("Chat deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete chat");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`detail ${showDetail ? "open" : ""}`}>
      <button
        className="closeDetail"
        onClick={() => setShowDetail && setShowDetail(false)}
        aria-label="Close details"
      >
        ×
      </button>
      <div className="user">
        <Avatar username={user?.username} size="large" />
        <h2>{user?.username}</h2>
        <p>{isCurrentUserBlocked ? "This user has blocked you" : "Chat member"}</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User Blocked"
            : "Block User"}
        </button>
        <button
          className="delete"
          onClick={handleDeleteChat}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Chat"}
        </button>
        <button
          className="logout"
          onClick={() => auth.signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
