import React, { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const handelAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   console.log(e);
  //   toast.warn = ("Hello Warn Message")
  // };
  const handleLogin = (e) => {
    e.preventDefault();
  
    // Get form data
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
  
    // Validation
    if (!email || !password) {
      toast.warn("Please fill in all fields!", {
        position: "bottom-right", // Matches the ToastContainer position
        autoClose: 3000, // Auto close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }
  
    console.log("Form submitted successfully", { email, password });
  };
  
  return (
    <div className="login">
      <div className="item">
        <h2>Welcome Back,</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button>Sign In</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload Profile Photo
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handelAvatar}
            />
            <input type="text" placeholder="Username" name="usernme" />
            <input type="email" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button type="submit">Sign In</button>
          </form>
        </div>
      </div>
    );
  };

export default Login;
