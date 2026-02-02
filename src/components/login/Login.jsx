import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    if (!email || !password) {
      setLoading(false);
      return toast.warn("Please fill in all fields");
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
    } catch (err) {
      console.error(err);
      const message = getAuthErrorMessage(err.code);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    if (!username || !email || !password) {
      setLoading(false);
      return toast.warn("Please fill in all fields");
    }

    if (username.length < 3) {
      setLoading(false);
      return toast.warn("Username must be at least 3 characters");
    }

    if (password.length < 6) {
      setLoading(false);
      return toast.warn("Password must be at least 6 characters");
    }

    try {
      // Check username uniqueness before creating auth user
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setLoading(false);
        return toast.warn("Username already taken");
      }

      // Create auth user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Create user document
      await setDoc(doc(db, "users", res.user.uid), {
        username: username.toLowerCase(),
        email,
        id: res.user.uid,
        blocked: [],
      });

      // Create user chats document
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created successfully!");
    } catch (err) {
      console.error(err);
      const message = getAuthErrorMessage(err.code);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getAuthErrorMessage = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "Email is already registered";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/weak-password":
        return "Password is too weak";
      case "auth/user-not-found":
        return "No account found with this email";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/invalid-credential":
        return "Invalid email or password";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later";
      default:
        return "Something went wrong. Please try again";
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        <div className="login-header">
          <h1>ChatGo</h1>
          <p>Connect with friends instantly</p>
        </div>

        <div className="tab-container">
          <button
            className={`tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
            type="button"
          >
            Sign Up
          </button>
        </div>

        {activeTab === "login" ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="Email address"
                name="email"
                autoComplete="email"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="login-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                name="username"
                autoComplete="username"
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email address"
                name="email"
                autoComplete="email"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}

        <p className="switch-text">
          {activeTab === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                className="switch-btn"
                onClick={() => setActiveTab("register")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="switch-btn"
                onClick={() => setActiveTab("login")}
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
