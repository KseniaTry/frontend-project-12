import { useFormik } from 'formik';
import { Form, Button, Card, FloatingLabel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../slices/authSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Header from './Header.jsx';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {t} = useTranslation()
  const error = useSelector(state => state.auth.error)

  const renderError = () => {
    return(
      <div className="text-danger small">{error}</div>
    )
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: async (values) => {
      await dispatch(login(values))
      navigate('/'); // Перенаправляем на главную страницу после успешного входа
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
            <FloatingLabel controlId='username' label='Ваш ник' className='mb-3'>
              <Form.Control name="username" type="text" placeholder='Ваш ник'
                onChange={formik.handleChange}
                value={formik.values.username}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.username}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId='password' label='Пароль' className='mb-3'>
              <Form.Control name="password" type="password" placeholder='Пароль'
                onChange={formik.handleChange}
                value={formik.values.password}
                required
              />
            </FloatingLabel>
            <Button type="submit" variant='secondary'>{t('login')}</Button>
            {error ? renderError(error) : null}
          </Form>
        </Card.Body>
        <Card.Footer>
          <span>
            Нет аккаунта?&nbsp;
            <Link to='/signup' className="text-decoration-none">Регистрация</Link>
          </span>
        </Card.Footer>
      </Card>
    </>
  );
};

export default Login