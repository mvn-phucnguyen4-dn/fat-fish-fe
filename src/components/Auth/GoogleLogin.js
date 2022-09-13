import React from 'react'
import { useHistory } from 'react-router-dom'
import { GoogleOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { auth } from '../../utils/initFirebase'
import useHttpClient from '../../hooks/useHttpClient'
import { signInWithPopup, GoogleAuthProvider, deleteUser } from 'firebase/auth'
import ErrorModal from '../../components/Modal/ErrorModal'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { fetchDataApi } from '../../utils/fetchDataApi'
import { toast } from 'react-toastify'
import { toastOptionError } from '../../utils/toastOption'

const GoogleLogin = (props) => {
  const { clearError, setError, error, isLoading, setIsLoading } =
    useHttpClient()
  const history = useHistory()

  const handleSignInGoogle = async () => {
    try {
      setIsLoading(true)
      const provider = new GoogleAuthProvider()
      const userCredentials = await signInWithPopup(auth, provider)

      if (userCredentials) {
        const response = await fetchDataApi('users', 'GET')
        const users = response.data
        const user = users.find(
          (user) => user.email === userCredentials.user.email,
        )

        if (!user) {
          history.push('/update-password')
        } else props.onLoginAPI()
      }
    } catch (error) {
      setIsLoading(false)
      setError(error.message.replace('Firebase:', ''))
      history.push('/auth')
    }
  }
  return (
    <>
      <ErrorModal error={error} onClose={clearError} />
      {isLoading ? <LoadingSpinner asOverlay={isLoading} /> : null}
      <Button
        className="btn btn__auth btn__google"
        type="primary"
        onClick={handleSignInGoogle}
        icon={<GoogleOutlined style={{ marginRight: '5px' }} />}
      >
        Continue with Google
      </Button>
    </>
  )
}

export default GoogleLogin
