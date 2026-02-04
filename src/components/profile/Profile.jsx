import { useState } from "react";
import "./profile.css";
import { toast } from "react-toastify";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { doc, updateDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import Avatar from "../common/Avatar";

const Profile = ({ isOpen, onClose }) => {
  const { currentUser, fetchUserInfo } = useUserStore();
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  if (!isOpen) return null;

  const handleUpdateBio = async () => {
    if (bio.length > 150) {
      toast.warn("Bio must be less than 150 characters");
      return;
    }

    setIsUpdating(true);

    try {
      const userDocRef = doc(db, "users", currentUser.id);
      await updateDoc(userDocRef, { bio });

      // Refresh user data
      await fetchUserInfo(currentUser.id);

      toast.success("Bio updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update bio");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.warn("Please enter your password to confirm");
      return;
    }

    setIsDeleting(true);

    try {
      const user = auth.currentUser;

      // Re-authenticate user before deletion
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(user, credential);

      // Delete user's chats from other users' chat lists
      const userChatsRef = doc(db, "userchats", currentUser.id);
      const userChatsSnap = await getDocs(
        query(collection(db, "userchats"), where("__name__", "==", currentUser.id))
      );

      // Get all chats the user is part of
      if (userChatsSnap.docs.length > 0) {
        const userChatsData = userChatsSnap.docs[0].data();
        const chats = userChatsData.chats || [];

        // Delete each chat document and remove from other users
        for (const chat of chats) {
          // Delete the chat document
          try {
            await deleteDoc(doc(db, "chats", chat.chatId));
          } catch (e) {
            console.error("Error deleting chat:", e);
          }

          // Remove chat from other user's list
          try {
            const otherUserChatsRef = doc(db, "userchats", chat.receiverId);
            const otherUserChatsSnap = await getDocs(
              query(collection(db, "userchats"), where("__name__", "==", chat.receiverId))
            );

            if (otherUserChatsSnap.docs.length > 0) {
              const otherUserChats = otherUserChatsSnap.docs[0].data().chats || [];
              const updatedChats = otherUserChats.filter((c) => c.chatId !== chat.chatId);
              await updateDoc(otherUserChatsRef, { chats: updatedChats });
            }
          } catch (e) {
            console.error("Error updating other user's chats:", e);
          }
        }
      }

      // Delete user's userchats document
      await deleteDoc(doc(db, "userchats", currentUser.id));

      // Delete user document from users collection
      await deleteDoc(doc(db, "users", currentUser.id));

      // Delete the Firebase Auth user
      await deleteUser(user);

      toast.success("Account deleted successfully");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else if (err.code === "auth/invalid-credential") {
        toast.error("Invalid credentials. Please check your password.");
      } else {
        toast.error("Failed to delete account. Please try again.");
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeletePassword("");
    }
  };

  return (
    <div className="profileOverlay" onClick={onClose}>
      <div className="profileModal" onClick={(e) => e.stopPropagation()}>
        <button className="closeBtn" onClick={onClose}>
          ×
        </button>

        <div className="profileHeader">
          <Avatar username={currentUser?.username} size="large" />
          <h2>{currentUser?.username}</h2>
          <p className="email">{currentUser?.email}</p>
        </div>

        <div className="profileSection">
          <label>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write something about yourself..."
            maxLength={150}
          />
          <div className="charCount">{bio.length}/150</div>
          <button
            className="updateBtn"
            onClick={handleUpdateBio}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Bio"}
          </button>
        </div>

        <div className="profileSection dangerZone">
          <h3>Danger Zone</h3>
          <p>Once you delete your account, there is no going back. All your data will be permanently removed.</p>

          {!showDeleteConfirm ? (
            <button
              className="deleteBtn"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </button>
          ) : (
            <div className="deleteConfirm">
              <input
                type="password"
                placeholder="Enter your password to confirm"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
              <div className="deleteActions">
                <button
                  className="cancelBtn"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletePassword("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="confirmDeleteBtn"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
