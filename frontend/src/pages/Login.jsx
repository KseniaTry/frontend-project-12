import { useFormik } from 'formik';
import { Form, Button, Card, FloatingLabel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header.jsx';
import Error from '../components/Error.jsx';
import { useRollbar } from '@rollbar/react';
import { handleLoginSubmit } from '../submits/loginSubmit.jsx';

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const rollbar = useRollbar()
  const {t} = useTranslation()
  const context = {dispatch, rollbar, t, navigate}
  const errorText = useSelector(state => state.auth?.errorText)
  const errorStatus =  useSelector(state => state.auth?.errorStatus)// при ошибке 401 рендерим в компоненте 

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: async (values, actions) => await handleLoginSubmit(values, actions, context)
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
            {errorStatus === 401 ? <Error error={errorText} errorStatus={errorStatus}/> : null}
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