import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'antd'
import Welcome from '../../components/Auth/Welcome'
import useForm from '../../hooks/useForm'
import { updatePasswordForm } from '../../utils/formConfig'
import { auth } from '../../utils/initFirebase'
import useHttpClient from '../../hooks/useHttpClient'
import { updatePassword } from 'firebase/auth'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { toastOptionError } from '../../utils/toastOption'
import { fetchDataApi } from '../../utils/fetchDataApi'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { AuthContext } from '../../context/auth'

const ChangePassword = () => {
  const { renderFormInputs, renderFormValues } = useForm(updatePasswordForm)
  const { login } = useContext(AuthContext)
  const formInputs = renderFormInputs()
  const formValues = renderFormValues()
  const history = useHistory()
  const { setError, isLoading, setIsLoading } = useHttpClient()

  const handleLoginAPI = async () => {
    try {
      setIsLoading(true)
      const currentUser = auth.currentUser
      const tokenId = await currentUser.getIdToken()
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
      }
    } catch (error) {
      setIsLoading(false)
      setError(error)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const { password, confirmPassword } = formValues
    if (password === confirmPassword) {
      try {
        await updatePassword(auth.currentUser, password)
        await handleLoginAPI()
      } catch (error) {
        toast.error('Some error', toastOptionError)
      }
    } else toast.error('Password not same', toastOptionError)
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay={isLoading} />}
      <div className="container container-auth">
        <Welcome />
        <form className="form__auth">
          <div className="form__options">
            <div className="registration__hr">
              <span className="registration__hr-label">
                Let update your password in the first time come here
              </span>
            </div>
            {formInputs}

            <Button
              className="btn btn__auth btn__auth--mode"
              onClick={handleChangePassword}
            >
              {'Update'}
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer></ToastContainer>
    </>
  )
}

export default ChangePassword
