import { toast } from "react-toastify";
import { setToken, setCurrentUsername, login} from "../slices/authSlice";
 
const handleLoginSubmit = async (values, actions, context) => {
  const {setSubmitting} = actions
  const {dispatch, rollbar, t, navigate} = context

  try {
    const response = await dispatch(login(values)).unwrap()
    const token = response.token
    dispatch(setToken(token))
    dispatch(setCurrentUsername(values.username))
    localStorage.setItem('userToken', token)
    localStorage.setItem('username', values.username)  
    navigate('/'); // перенаправляем на главную страницу после успешного входа
  } catch(err) {
    if (err?.status === 500 || err?.status === 502) {
      toast.error(t('errors.500'))
    } else if (err?.status !== 401) {
      toast.error(t('errors.server', {error: err.data.error}));
      rollbar.error(t('errors.auth'), err);
    }
 
    dispatch(setToken(''))
    dispatch(setCurrentUsername(''))
    localStorage.removeItem('userToken')
    localStorage.removeItem('username')
  } finally {
    setSubmitting(false);
  }
}

export {handleLoginSubmit}