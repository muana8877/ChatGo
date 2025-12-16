import React from 'react'
import "./list.css"
import UserInfo from './UserInfo/UserInfo'
import ChatList from './chatList/ChatList'

const List = ({ showSidebar, setShowSidebar }) => {
  return (
    <>
      <div className={`list ${showSidebar ? "open" : ""}`}>
      <button
        className="closeSidebar"
        onClick={() => setShowSidebar && setShowSidebar(false)}
        aria-label="Close sidebar"
      >
        ×
      </button>
      <UserInfo />
      <ChatList />
      </div>
      {showSidebar && (
        <div
          className="sidebarOverlay"
          onClick={() => setShowSidebar && setShowSidebar(false)}
        />
      )}
    </>
  );
};

export default List