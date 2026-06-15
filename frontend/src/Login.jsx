 import React from 'react';
 import { useFormik } from 'formik';
import { Form, Button, Container } from 'react-bootstrap';

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
     <Form onSubmit={formik.handleSubmit}>
         <Container class="form-floating mb-3">
       <Form.Label htmlFor="name">Ваш ник</Form.Label>
       <Form.Control
         id="name"
         name="name"
         type="text"
         placeholder='Ваш ник'
        //  onChange={formik.handleChange}
        //  value={formik.values.email}
       />
       </Container>
        <Container class="form-floating mb-3">
           <Form.Label htmlFor="password">Пароль</Form.Label>
       <Form.Control
         id="password"
         name="password"
         type="password"
              placeholder='Пароль'
         onChange={formik.handleChange}
         value={formik.values.email}
       />
 </Container>
       <Button type="submit">Войти</Button>
     </Form>
   );
 };

export default Login