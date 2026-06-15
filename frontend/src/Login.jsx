import React from 'react';
import { useFormik } from 'formik';
import { Form, Button, Container, Card, FloatingLabel } from 'react-bootstrap';

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
      <Card.Header>Войти</Card.Header>
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
          <Button type="submit">Войти</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Login