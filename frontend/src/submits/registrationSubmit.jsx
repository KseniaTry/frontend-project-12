import { setToken, setCurrentUsername, setAuthStatus } from "../slices/authSlice";
import { createNewUser } from "../slices/usersSlice";

const handleRegistrationSubmit = async (values, actions, context) => {
  const {setErrors, setSubmitting} = actions
  const {dispatch, navigate, rollbar, t} = context

  const newUser = {
    username: values.username,
    password: values.password
  }

  try {
    const response =  await dispatch(createNewUser(newUser)).unwrap()
    localStorage.setItem('userToken', response.token)
    localStorage.setItem('username', response.username)
    dispatch(setToken(response.token))
    dispatch(setCurrentUsername(response.username))
    dispatch(setAuthStatus(true))
    navigate('/') 
  } catch(err) {
    if (err?.status === 409) {
      setErrors({ username: t('validation.usernameCheck') }); // показываем в интерфейсе
    } else {
      rollbar.error(t('errors.registration'), err)
    }
  } finally {
    setSubmitting(false);
  }
}

export {handleRegistrationSubmit}