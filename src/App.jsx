import { useEffect, useState } from "react";
import List from "./components/List/List";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import Login from "./components/login/Login";
import EmptyChat from "./components/emptyChat/EmptyChat";
import Notifications from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";

const App = () => {
  
  const {currentUser, isLoading, fetchUserInfo} = useUserStore()
  const { chatId } = useChatStore();
  // show sidebar by default on larger screens, hide on small screens
  const [showSidebar, setShowSidebar] = useState(() => {
    try {
      return window.innerWidth > 900;
    } catch (e) {
      return true;
    }
  });
  const [showDetail, setShowDetail] = useState(false);

  useEffect(()=>{
    const unSub = onAuthStateChanged(auth, (user) =>{
      fetchUserInfo(user?.uid);
      useChatStore.getState().resetChat();
    });

    return () =>{
      unSub();
    }
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;
  return (
    <div className="container">
      {currentUser ? (
        <>
          <List showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          {chatId ? (
            <>
              <Chat
                toggleSidebar={() => setShowSidebar((s) => !s)}
                toggleDetail={() => setShowDetail((s) => !s)}
              />
              <Detail showDetail={showDetail} setShowDetail={setShowDetail} />
            </>
          ) : (
            <EmptyChat />
          )}
        </>
      ) : (
        <Login />
      )}
      <Notifications />
    </div>
  );
};

export default App;
