import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { GoogleOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { auth } from '../../utils/initFirebase'
import useHttpClient from '../../hooks/useHttpClient'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import ErrorModal from '../../components/Modal/ErrorModal'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const GoogleLogin = (props) => {
  const { clearError, setError, error, isLoading, setIsLoading } =
    useHttpClient()
  const history = useHistory()

  const handleSignInGoogle = async () => {
    try {
      setIsLoading(true)
      const provider = new GoogleAuthProvider()
      const user = await signInWithPopup(auth, provider)
      if (user) props.onLoginAPI()
      else setIsLoading(false)
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
