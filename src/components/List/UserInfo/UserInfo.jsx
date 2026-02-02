import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import Avatar from "../../common/Avatar";

const UserInfo = () => {
  const { currentUser } = useUserStore();

  return (
    <div className="userInfo">
      <div className="user">
        <Avatar username={currentUser?.username} size="medium" />
        <h2>{currentUser?.username}</h2>
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
