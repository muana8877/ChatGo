import React, { useEffect } from "react";
import List from "./components/list/list";
import Chat from "./components/chat/chat";
import Detail from "./components/detail/detail";
import Login from "./components/login/Login";
import Notifications from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import {auth, db} from "./lib/firebase";
import { useUserStore } from "./lib/userStore";

const App = () => {
  
  const {currentUser, isLoading, fetchUserInfo} = useUserStore()

  useEffect(()=>{
    const unSub = onAuthStateChanged(auth, (user) =>{
      fetchUserInfo(user?.uid);
    });

    return () =>{
      unSub();
    }
  }, [fetchUserInfo]);

  console.log(currentUser)

  if (isLoading) return <div className="loading">Loading...</div>;
  return (
    <div className="container">
      {currentUser ? (
        <>
          <List />
          <Chat />
          <Detail />
        </>
      ) : (
        <Login />
      )}
      <Notifications />
    </div>
  );
};

export default App;
