import { useState } from "react";
import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import Avatar from "../../common/Avatar";
import Profile from "../../profile/Profile";

const UserInfo = () => {
  const { currentUser } = useUserStore();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <div className="userInfo">
        <div className="user" onClick={() => setShowProfile(true)} style={{ cursor: "pointer" }}>
          <Avatar username={currentUser?.username} size="medium" />
          <h2>{currentUser?.username}</h2>
        </div>
        <div className="icons">
          <img src="./more.png" alt="More options" />
          <img src="./video.png" alt="Video call" />
          <img
            src="./edit.png"
            alt="Edit profile"
            onClick={() => setShowProfile(true)}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      <Profile isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
};

export default UserInfo;
