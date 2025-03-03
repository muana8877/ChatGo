import React, { useState } from "react";
import "./addUser.css";
import { arrayUnion, collection,  doc,  getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useUserStore } from "../../../../lib/userStore";
const AddUser = () => {
  const [user, setUser] = useState(null);
  const {currentUser} = useUserStore();
  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnampshot = await getDocs(q);

      if (!querySnampshot.empty) {
        setUser(querySnampshot.docs[0].data());
      } else {
        toast.error(`No user found with the username: ${username}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {

    const chatRef = collection(db, "chats")
    const userChatsRef = collection(db, "userchats")

    try{
      const newChatRef = doc(chatRef);

      const chat = await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc( userChatsRef, user.id), {
        chats:arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        })
      })

      await updateDoc(doc( userChatsRef, currentUser.id), {
        chats:arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        })
      })

      console.log(newChatRef.id);
    }
    catch(err){
      console.error(err);
    }
  }
  const firstChar = user?.username?.charAt(0).toUpperCase() || "?";
  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && <div className="user">
        <div className="detail">
        <div
              className="avatar"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "#5183fe", // You can make this dynamic
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {firstChar}
            </div>
          <span>{user.username}</span>
        </div>
        <button onClick={handleAdd}>Add User</button>
      </div>}
    </div>
  );
};

export default AddUser;
