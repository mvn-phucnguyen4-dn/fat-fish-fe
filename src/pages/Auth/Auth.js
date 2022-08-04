import React, { useContext, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { AuthContext } from '../../context/auth'
import { useHttpClient } from '../../hooks/useHttpClient'
import GLogin from '../../components/Auth/GLogin'
import useForm from '../../hooks/useForm'
import { loginForm, signupForm } from '../../utils/formConfig'
import { appendData } from '../../utils'
import Welcome from '../../components/Auth/Welcome'
import './Auth.css'
import ErrorModal from '../../components/Modal/ErrorModal'

const Auth = ({ newUser }) => {
  const { renderFormInputs, renderFormValues, isFormValid, setForm } =
    useForm(signupForm)

  useEffect(() => {
    if (!newUser) {
      setForm(loginForm)
    } else {
      setForm(signupForm)
    }
  }, [newUser, setForm])

  const formValues = renderFormValues()
  const formInputs = renderFormInputs()

  const { login } = useContext(AuthContext)
  const history = useHistory()

  const { sendReq, error, clearError } = useHttpClient()

  //handle google auth
  const handleGoogleAuth = async (googleData) => {
    //getting tokenID from GLogin
    console.log(googleData, 'User in authen')
    const token = await googleData.getIdToken()
    const responseData = await sendReq(
      `${process.env.REACT_APP_BASE_URL}/users/auth/google`,
      'POST',
      JSON.stringify({
        tokenId: token,
      }),
      {
        'Content-Type': 'application/json', //inform backend the type of data being sent
      },
    )
    let { user } = responseData
    user = { ...user, token: googleData.tokenId }
    login(user) //log the user in
    history.push('/')
  }

  const handleAuthSubmit = async (evt) => {
    evt.preventDefault()
    try {
      let responseData
      if (newUser) {
        const formData = appendData(formValues)
        responseData = await sendReq(
          `${process.env.REACT_APP_BASE_URL}/users/signup`,
          'POST',
          formData,
        )
      } else {
        responseData = await sendReq(
          `${process.env.REACT_APP_BASE_URL}/users/login`,
          'POST',
          JSON.stringify(formValues),
          {
            'Content-Type': 'application/json',
          },
        )
      }
      login(responseData.user)
      history.push('/')
    } catch (err) {}
  }

  return (
    <>
      <ErrorModal error={error} onClose={clearError} />
      <div className="container container-auth">
        <Welcome />
        <div className="auth__social">
          <GLogin onLogin={handleGoogleAuth} />
        </div>

        <form className="form__auth">
          <div className="form__options">
            <p>Or</p>
            <h2>
              {newUser
                ? 'Create a New Account'
                : 'Log in using an Existing Account'}
            </h2>
            {formInputs}

            <button
              onClick={handleAuthSubmit}
              className="btn btn__auth btn__auth--mode"
              disabled={!isFormValid()}
            >
              {newUser ? 'Create account' : 'Login'}
            </button>
            <Link
              className="btn btn__auth btn__auth--switch"
              to={newUser ? '/auth' : '/auth/new-user'}
            >
              {newUser ? 'Login' : 'Create account'}
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}

export default Auth
