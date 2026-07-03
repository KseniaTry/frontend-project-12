import { useFormik } from 'formik';
import { Form, Button, Card, FloatingLabel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../slices/authSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Header from './Header.jsx';
import Error from './Error.jsx';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const rollbar = useRollbar()
  const {t} = useTranslation()
  const errorText = useSelector(state => state.auth?.errorText)
  const errorStatus =  useSelector(state => state.auth?.errorStatus)// при ошибке 401 рендерим в компоненте 

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: async (values, {setSubmitting}) => {
      try {
        const response = await dispatch(login(values)).unwrap()
        const token = response.token
        console.log(token)
        localStorage.setItem('userToken', token)
        localStorage.setItem('username', values.username)  
        setSubmitting(false);
        navigate('/'); // перенаправляем на главную страницу после успешного входа
      } catch(err) {
        if (err?.status === 500 || err?.status === 502) {
          toast.error(t('errors.500'))
        } else {
          const msg = err?.message || err?.error || t('errors.undefined');
          toast.error(t('errors.server', {error: msg}));
        }
        rollbar.error(t('errors.auth'), err);
        localStorage.removeItem('userToken')
        localStorage.removeItem('username')
      }
    },
  });

  return (
    <>
      <Header />
      <Card>
        <Card.Header>
          <h1>{t('login')}</h1>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={formik.handleSubmit}>
            <FloatingLabel controlId='username' label={t('loginForm.nickname')} className='mb-3'>
              <Form.Control name="username" type="text" placeholder={t('loginForm.nickname')}
                onChange={formik.handleChange}
                value={formik.values.username}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.username}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId='password' label={t('loginForm.password')} className='mb-3'>
              <Form.Control name="password" type="password" placeholder={t('loginForm.password')}
                onChange={formik.handleChange}
                value={formik.values.password}
                required
              />
            </FloatingLabel>
            <Button type="submit" variant='secondary' disabled={formik.isSubmitting}>{t('login')}</Button>
            {errorStatus === 401 ? <Error error={errorText}/> : null}
          </Form>
        </Card.Body>
        <Card.Footer>
          <span>
            {t('loginForm.question')}&nbsp;
            <Link to='/signup' className="text-decoration-none">{t('loginForm.registration')}</Link>
          </span>
        </Card.Footer>
      </Card>
    </>
  );
};

export default Login