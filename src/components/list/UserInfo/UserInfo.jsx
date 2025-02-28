import React from 'react'
import "./UserInfo.css"
import { useUserStore } from '../../../lib/userStore'
const UserInfo = () => {
  const {currentUser, isLoading, fetchUserInfo} = useUserStore()
  return (
    <div className='userInfo'>
        <div className="user">
            <img src="./avatar.png" alt="" />
            <h2>{currentUser.username}</h2>
        </div>
        <div className="icons">
            <img src="./more.png" alt="" />
            <img src="./video.png" alt="" />
            <img src="./edit.png" alt="" />
        </div>
    </div>
  )
}

export default UserInfo