import React from "react";
import List from "./components/list/list";
import Chat from "./components/chat/chat";
import Detail from "./components/detail/detail";
import Login from "./components/login/Login";
import Notifications from "./components/notification/Notification";

const App = () => {
  const user = true;
  return (
    <div className="container">
      {user ? (
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
