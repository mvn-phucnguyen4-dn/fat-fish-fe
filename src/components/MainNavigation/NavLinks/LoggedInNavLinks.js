import { RiNotificationLine } from '@react-icons/all-files/ri/RiNotificationLine'
import React, { useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import Avatar from '../../Avatar/Avatar'
import { Dropdown } from '../Dropdown'
import { useHistory } from 'react-router-dom'
import { fetchDataApi } from '../../../utils/fetchDataApi'
import { auth } from '../../../utils/initFirebase'

export const LoggedInNavLinks = ({
  unreadNotifications,
  setUnreadNotifications,
  currentUser,
  logout,
}) => {
  const history = useHistory()
  const handleRedirect = useCallback((url) => history.push(url), [history])
  const [showMenu, setShowMenu] = useState(false)
  const handleClick = () => {
    setUnreadNotifications([])
    handleRedirect(`/users/${currentUser && currentUser.userId}/notifications`)
  }
  const handleDropdown = () => {
    setShowMenu((showMenu) => !showMenu)
  }

  const handleLogout = () => {
    setShowMenu(false)
    logout()
  }

  const createTopic = async () => {
    try {
      const token = await auth.currentUser.getIdToken()
      const topic = {
        title: 'Topic title',
        description: 'Topic description',
        totalScore: 0,
        isPrivate: true,
        hashtagIds: [],
      }
      const response = await fetchDataApi('topics', token, 'POST', topic)
      if (response.data) {
        history.push(`/topics/${1}/edit`)
      }
    } catch (error) {}
  }

  return (
    <React.Fragment>
      <li className="list__item list__item--mobile item--create">
        <button className="create-link" onClick={createTopic}>
          Create Post
        </button>
      </li>
      <li
        className="list__item list__item--notifs hvr-bg-lt"
        onClick={handleClick}
      >
        <NavLink
          className="link"
          to={`/users/${currentUser && currentUser.userId}/notifications`}
          exact
        >
          <div className="link--notifs-icon">
            <RiNotificationLine size="2.5rem" />
            {unreadNotifications && unreadNotifications.length > 0 && (
              <div className="notif__counter">{unreadNotifications.length}</div>
            )}
          </div>
        </NavLink>
      </li>

      <li>
        <button
          className="btn nav__btn"
          onClick={handleDropdown}
          onBlur={() => setShowMenu(false)}
        >
          <Avatar src={currentUser && currentUser.avatar} />
        </button>
      </li>

      <Dropdown
        showMenu={showMenu}
        handleLogout={handleLogout}
        setShowMenu={setShowMenu}
        currentUser={currentUser}
      />
    </React.Fragment>
  )
}
