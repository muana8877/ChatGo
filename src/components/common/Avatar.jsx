import "./avatar.css";

const Avatar = ({ username, size = "medium" }) => {
  const firstChar = username?.charAt(0).toUpperCase() || "?";

  const sizeClasses = {
    small: "avatar-small",
    medium: "avatar-medium",
    large: "avatar-large",
  };

  return (
    <div className={`avatar ${sizeClasses[size] || sizeClasses.medium}`}>
      {firstChar}
    </div>
  );
};

export default Avatar;
