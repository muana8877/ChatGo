import React, { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {auth, db} from "../../lib/firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";


const Login = () => {
  const [loading, setLoading] = useState(false);
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
  const handleLogin = async  (e) => {
    e.preventDefault();
    
    setLoading(true);
  
    // Get form data
    const formData = new FormData(e.target);
    const {email, password} = Object.fromEntries(formData);
  
    try{

      await signInWithEmailAndPassword(auth,email, password);
      toast.success("Logged In Successfully!");
      // Redirect to chat
      // history.push("/");
    }
    catch(err){
      console.error(err);
      toast.error(err.message);
    }
    finally{
      setLoading(false);
    }
  };

  const handleRegister = async (e) =>{
    e.preventDefault();
    setLoading(true)
    const formData = new FormData(e.target)
    const {username,email,password}  = Object.fromEntries(formData);

    // VALIDATE INPUTS
    if (!username || !email || !password)
      return toast.warn("Please enter inputs!");
    // VALIDATE UNIQUE USERNAME
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return toast.warn("Select another username");
    }

    try{
      const res = await createUserWithEmailAndPassword(auth,email,password);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Acount created!");

      // Redirect to chat
      // history.push("/");
    }catch(err){
      console.error(err);
      toast.error(err.message);
    }
  }
  
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
        <form onSubmit={handleRegister}>
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
            <input type="text" placeholder="Username" name="username" />
            <input type="email" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button type="submit">Sign In</button>
          </form>
        </div>
      </div>
    );
  };

export default Login;
