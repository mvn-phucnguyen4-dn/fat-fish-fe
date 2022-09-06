import React, { useEffect, useState } from 'react'
import { Tag } from 'antd'
import { fetchDataApi } from '../../../utils/fetchDataApi'
import { toast } from 'react-toastify'
import { toastOptions } from '../../../utils/toastOption'

const COLORS = [
  'red',
  'magenta',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
]

const MAX_LENGTH_EMAIL = 30
const ranColor = () => {
  const ranIndex = Math.floor(Math.random() * COLORS.length)
  return COLORS[ranIndex]
}

const UserInput = (props) => {
  const [suggestUsers, setSuggestUsers] = useState([])
  const [userInServer, setUserInServer] = useState([])
  const [isShowSuggest, setIsShowSuggest] = useState(false)
  const { users, addUser, removeUser } = props

  useEffect(() => {
    const fetchGetUsers = async () => {
      try {
        const response = await fetchDataApi('users', null, 'GET')
        setUserInServer([...response.data])
      } catch (error) {
        toast.error(toastOptions, error.message)
      }
    }
    fetchGetUsers()
  }, [])

  const handleAddUser = async (e) => {
    const email = e.target.value.trim()
    let reg = new RegExp(email)
    if (email.length > MAX_LENGTH_EMAIL || email == '') return
    if (e.code === 'Enter' && email !== '') {
      const user = userInServer.filter((user) => {
        if (user.email.match(reg)) {
          return user
        }
      })[0]
      addUser(user)
      e.target.value = ''
    }
  }

  const suggestUser = (e) => {
    const input = e.target.value
    let reg = new RegExp(input)
    setSuggestUsers((suggestUsers) => {
      suggestUsers = userInServer.filter((user) => {
        if (user.email.match(reg)) {
          return user
        }
      })
      return suggestUsers
    })
  }

  return (
    <>
      <h4>Contributors</h4>
      <div className="tags__input" onClick={() => setIsShowSuggest(true)}>
        <input
          type="text"
          placeholder="Press enter to add contributors"
          onKeyUp={handleAddUser}
          onChange={suggestUser}
          onBlur={() => {
            setIsShowSuggest(false)
          }}
        />
        <div className={`dropdown-tag ${!isShowSuggest && 'hide-dropdown'}`}>
          {suggestUsers &&
            suggestUsers.slice(0, 5).map((user, index) => (
              <div
                className="dropdown-row"
                key={user.id}
                onClick={() => {
                  addUser(user)
                }}
              >
                {user.email}
              </div>
            ))}
        </div>

        <ul className="input__list">
          {users &&
            users.map((user) => (
              <Tag
                key={user.id}
                closable
                onClose={() => removeUser(user.id)}
                color={ranColor()}
              >
                {user.email}
              </Tag>
            ))}
        </ul>
      </div>
    </>
  )
}

export default UserInput
