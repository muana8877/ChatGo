import React from "react";
import "./detail.css";
import { auth } from "../../lib/firebase";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = ({ showDetail, setShowDetail }) => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
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
      console.log(err);
    }
  };
  const firstChar = user?.username?.charAt(0).toUpperCase() || "?";
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
        <div
          className="avatar"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "#5183fe", // Change this dynamically if needed
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "50px",
            fontWeight: "bold",
          }}
        >
          {firstChar}
        </div>

        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>
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
          className="logout"
          onClick={() => {
            auth.signOut();
            console.log("Logout btn clicked");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
