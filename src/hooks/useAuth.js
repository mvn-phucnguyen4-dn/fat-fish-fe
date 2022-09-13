import { useState, useEffect, useCallback } from 'react'
import useHttpClient from './useHttpClient'
import { auth } from '../utils/initFirebase'
import { signOut } from 'firebase/auth'

let refreshTimer

const useAuth = () => {
  const [token, setToken] = useState(false)
  const [tokenExpirationDate, setTokenExpirationDate] = useState()
  const [userId, setUserId] = useState(null)
  const [user, setUser] = useState({})
  const { sendReq } = useHttpClient()

  //useCallback((uid, token, expirationDate)
  // the token is firebase have expire in 1 hour
  const login = useCallback((user, expirationDate) => {
    setUser(user)
    setToken(user.accessToken)
    setUserId(user.userId)
    const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60)
    setTokenExpirationDate(tokenExpirationDate)

    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: user.userId,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        avatar: user.avatar,
        email: user.email,
        name: user.name,
        expiration: tokenExpirationDate.toISOString(),
      }),
    )
  }, [])

  const logout = useCallback(() => {
    signOut(auth)
    setToken(null)
    setUserId(null)
    setUser(null)
    setTokenExpirationDate(null)
    localStorage.removeItem('userData')
  }, [sendReq])

  const refreshToken = useCallback(async () => {
    const newToken = await auth.currentUser.getIdToken(true)
    const storedData = JSON.parse(localStorage.getItem('userData'))
    const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60)
    storedData.accessToken = newToken
    storedData.expiration = tokenExpirationDate.toISOString()
    localStorage.setItem(
      'userData',
      JSON.stringify({
        id: storedData.storedDataId,
        accessToken: newToken,
        refreshToken: storedData.refreshToken,
        avatar: storedData.avatar,
        email: storedData.email,
        name: storedData.name,
        expiration: tokenExpirationDate.toISOString(),
      }),
    )
    setTokenExpirationDate(tokenExpirationDate)
    setToken(newToken)
  }, [sendReq])

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime() - 1000 * 60 // refresh token every 59 minute
      refreshTimer = setTimeout(refreshToken, remainingTime)
    } else {
      clearTimeout(refreshTimer)
    }
  }, [token, tokenExpirationDate])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if (storedData && new Date(storedData.expiration) > new Date()) {
      login(
        // storedData.userId,
        // storedData.token,
        storedData,
        new Date(storedData.expiration),
      )
    } else {
      logout()
    }
  }, [login]) // [] => only run once when the component is mounted first time
  return { token, login, logout, userId, user, setUser }
}

export default useAuth
