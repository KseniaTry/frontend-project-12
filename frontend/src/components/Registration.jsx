import { Card, Form , FloatingLabel, Button} from "react-bootstrap"
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import { createNewUser } from "../slices/usersSlice";
import { setAuthStatus, setCurrentUsername, setToken } from "../slices/authSlice";
import { useRollbar } from "@rollbar/react";
import { getRegistrationSchema } from "../schemas";

const Registration = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const rollbar = useRollbar()
  const {t} = useTranslation()

  const schema = getRegistrationSchema(t)

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
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}

export default Registration