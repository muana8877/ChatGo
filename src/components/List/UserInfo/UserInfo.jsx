import React from "react";
import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
const UserInfo = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const firstChar = currentUser?.username?.charAt(0).toUpperCase() || "?";
  return (
    <div className="userInfo">
      <div className="user">
        <div
          className="avatar"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: "#5183fe", // Change this dynamically if needed
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "20px",
          }}
        >{firstChar}</div>
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="" />
        <img src="./video.png" alt="" />
        <img src="./edit.png" alt="" />
      </div>
    </div>
  );
};

export default UserInfo;
