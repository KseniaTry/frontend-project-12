import { Card, Form , FloatingLabel, Button} from "react-bootstrap"
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import * as yup from 'yup';
import { createNewUser } from "../slices/usersSlice";
import Error from "./Error";
import { setAuthStatus } from "../slices/authSlice";
import { useRollbar } from "@rollbar/react";

const Registration = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const rollbar = useRollbar()
  const {t} = useTranslation()
  const error = useSelector(state => state.users?.errorText)

  const schema = yup.object().shape({
    username: yup.string()
      .min(3, t('validation.usernameLength'))
      .max(20, t('validation.usernameLength'))
      .required(t('validation.required')),
    password: yup.string()
      .min(6, t('validation.passwordLength'))
      .required(t('validation.required')),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], t('validation.passwordConfirm'))
      .required(t('validation.required'))
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: schema,
    onSubmit: async (values, {setErrors, setSubmitting}) => {
      const newUser = {
        username: values.username,
        password: values.password
      }
      try {
        const response =  await dispatch(createNewUser(newUser)).unwrap()
        localStorage.setItem('userToken', response.token)
        localStorage.setItem('username', response.username)
        dispatch(setAuthStatus(true))
        navigate('/') 
      } catch(err) {
        if (err?.status === 409) {
          setErrors({ username: t('validation.usernameCheck') }); // показываем в интерфейсе
        }
        rollbar.error(t('errors.registration'), err);
      } finally {
        setSubmitting(false);
      }
    }
  })
  
  return(
    <>
      <Header />
      <Card>
        <Card.Header>
          <h1>{t('registration.title')}</h1>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={formik.handleSubmit}>
            <FloatingLabel controlId='username' label={t('registration.username')} className='mb-3'>
              <Form.Control name="username" type="text" placeholder={t('registration.username')}
                onChange={formik.handleChange}
                value={formik.values.username}
                isInvalid={formik.touched.username && formik.errors.username}
                onBlur={formik.handleBlur}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.username}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId='password' label={t('registration.password')} className='mb-3'>
              <Form.Control name="password" type="password" placeholder={t('registration.password')}
                onChange={formik.handleChange}
                value={formik.values.password}
                isInvalid={formik.touched.password && formik.errors.password}
                onBlur={formik.handleBlur}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId='confirmPassword' label={t('registration.passwordConfirm')} className='mb-3'>
              <Form.Control name="confirmPassword" type="password" placeholder={t('registration.passwordConfirm')}
                onChange={formik.handleChange}
                value={formik.values.passwordConfirmation}
                isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
                onBlur={formik.handleBlur}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.confirmPassword}
              </Form.Control.Feedback>
            </FloatingLabel>
            <Button 
              type="submit" 
              variant='secondary'
              disabled={formik.isSubmitting}>
              {t('registration.button')}
            </Button>
            {error ? <Error error={error}/> : null}
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}

export default Registration