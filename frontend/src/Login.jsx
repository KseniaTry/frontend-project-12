import React from 'react';
import { useFormik } from 'formik';
import { Form, Button, Card, FloatingLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Login = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      password: ''
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <Card>
      <Card.Header>
        <h1>Войти</h1>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FloatingLabel controlId='name' label='Ваш ник' className='mb-3'>
            <Form.Control id="name" name="name" type="text"placeholder='Ваш ник'
              //  onChange={formik.handleChange}
              //  value={formik.values.email}
            />
          </FloatingLabel>
          <FloatingLabel controlId='password' label='Пароль' className='mb-3'>
            <Form.Control id="password" name="password" type="password" placeholder='Пароль'
              // onChange={formik.handleChange}
              // value={formik.values.email}
            />
            <Form.Label htmlFor="password">Пароль</Form.Label>
          </FloatingLabel>
          <Button type="submit" variant='secondary'>Войти</Button>
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