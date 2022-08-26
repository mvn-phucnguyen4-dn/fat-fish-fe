import React, { useState, useEffect, useContext } from 'react'
import { useHttpClient } from '../../hooks/useHttpClient'
import { AuthContext } from '../../context/auth'
import Notification from '../../components/Notification/Notification'
import './Notifications.css'
import ErrorModal from '../../components/Modal/ErrorModal'
import SkeletonPostList from '../../components/Skeleton/SkeletonPostList'

const Notifications = ({ user, userFollowStats }) => {
  const { currentUser } = useContext(AuthContext)
  const [notifications, setNotifications] = useState([])
  const { isLoading, sendReq, error, clearError } = useHttpClient()

  return (
    <>
      <ErrorModal error={error} onClose={clearError} />
      <div className="container container-notif-page">
        {isLoading ? (
          <SkeletonPostList type="mini" />
        ) : (
          <>
            <h3 className="notif__heading">Notifications</h3>
            <div className="notifications">
              {notifications && notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Notification
                    key={notification.id}
                    user={user}
                    notification={notification}
                  />
                ))
              ) : (
                <p>No notifications found!</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Notifications
