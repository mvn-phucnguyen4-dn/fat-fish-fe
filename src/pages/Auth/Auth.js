import React, { useContext, useEffect, useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button } from 'antd'
import Welcome from '../../components/Auth/Welcome'
import useForm from '../../hooks/useForm'
import { loginForm, signupForm } from '../../utils/formConfig'
import { auth } from '../../utils/initFirebase'
import useHttpClient from '../../hooks/useHttpClient'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import ErrorModal from '../../components/Modal/ErrorModal'
import { AuthContext } from '../../context/auth'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import GoogleLogin from '../../components/Auth/GoogleLogin'
import './Auth.css'
import { fetchDataApi } from '../../utils/fetchDataApi'

const Auth = ({ newUser }) => {
  const { renderFormInputs, renderFormValues, setForm } = useForm(loginForm)
  const { login } = useContext(AuthContext)
  const formInputs = renderFormInputs()
  const formValues = renderFormValues()
  const history = useHistory()
  const { sendReq, error, clearError, setError, isLoading, setIsLoading } =
    useHttpClient()

  useEffect(() => {
    if (newUser) {
      setForm(signupForm)
    } else {
      setForm(loginForm)
    }
  }, [newUser, setForm])

  const handleLoginAPI = async () => {
    try {
      setIsLoading(true)
      const currentUser = auth.currentUser
      const tokenId = await currentUser.getIdToken()
      console.log(tokenId)
      const response = await fetchDataApi(`users/login`, null, 'POST', {
        tokenId,
      })
      if (response.data) {
        const {
          accessToken,
          email,
          displayName: name,
          photoURL: avatar,
        } = currentUser
        const { refreshToken } = currentUser.stsTokenManager
        login(
          {
            accessToken,
            refreshToken,
            avatar,
            name,
            email,
            userId: response.data.id,
          },
          new Date(currentUser.stsTokenManager.expirationTime),
        )
        history.push('/')
      } else {
        setIsLoading(false)
        history.push('/auth')
      }
    } catch (error) {
      setIsLoading(false)
      setError(error)
    }
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const { email, password, name, confirmPassword } = formValues
    if (confirmPassword && password !== confirmPassword) {
      setError('Password and confirm password not same!')
      setIsLoading(false)
      return
    }
    try {
      if (newUser) {
        await createUserWithEmailAndPassword(auth, email, password)
        const currentUser = auth.currentUser
        await updateProfile(currentUser, {
          displayName: name,
        })
      }
      const user = await signInWithEmailAndPassword(auth, email, password)
      if (user) {
        await handleLoginAPI()
      }
    } catch (error) {
      setIsLoading(false)
      setError(error.message.replace('Firebase:', ''))
      history.push('/auth/new-user')
    }
  }

  const lockScroll = useCallback(() => {
    document.body.style.overflow = 'hidden'
  }, [])

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = ''
  }, [])

  if (isLoading) {
    lockScroll()
  } else {
    unlockScroll()
  }
  return (
    <>
      <ErrorModal error={error} onClose={clearError} />
      {isLoading && <LoadingSpinner asOverlay={isLoading} />}
      <div className="container container-auth">
        <Welcome />
        <form className="form__auth">
          <GoogleLogin onLoginAPI={handleLoginAPI} />
          <div className="form__options">
            <div className="registration__hr">
              <span className="registration__hr-label">
                {newUser
                  ? 'Create your account with email and password'
                  : 'Have a password? Continue with your email address'}
              </span>
            </div>
            {formInputs}

            <Button
              className="btn btn__auth btn__auth--mode"
              onClick={handleAuthSubmit}
            >
              {newUser ? 'Sign up' : 'Login'}
            </Button>
            <Link className="btn btn__auth btn__auth--switch">
              I forgot my password
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}

export default Auth
