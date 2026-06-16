import { useFormik } from 'formik';
import { Form, Button, Card, FloatingLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {actions as authActions} from '../slices/AuthSlice.jsx';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('')

  const renderError = (error) => {
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
      try {
        const response = await axios.post('/api/v1/login', values)
        const token = response.data;
        localStorage.setItem('userToken', JSON.stringify(token))
        authActions.isAuth(true); // Устанавливаем состояние авторизации в true
        authActions.setToken(token); // Устанавливаем токен в состояние
        navigate('/'); // Перенаправляем на главную страницу после успешного входа
      } catch(err) {
        if (err.response && err.response.status === 401) {
          setError('Неверный логин или пароль');
        } else {
          setError('Другая ошибка сервера:', err.message);
        }
      }
    },
  });

  return (
    <Card>
      <Card.Header>
        <h1>Войти</h1>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FloatingLabel controlId='username' label='Ваш ник' className='mb-3'>
            <Form.Control name="username" type="text"placeholder='Ваш ник'
              onChange={formik.handleChange}
              value={formik.values.username}
            />
          </FloatingLabel>
          <FloatingLabel controlId='password' label='Пароль' className='mb-3'>
            <Form.Control name="password" type="password" placeholder='Пароль'
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </FloatingLabel>
          <Button type="submit" variant='secondary'>Войти</Button>
          {renderError(error)}
        </Form>
      </Card.Body>
      <Card.Footer>
        <span>
          Нет аккаунта?&nbsp;
          <Link to='#' className="text-decoration-none">Регистрация</Link>
        </span>
      </Card.Footer>
    </Card>
  );
};

export default Login