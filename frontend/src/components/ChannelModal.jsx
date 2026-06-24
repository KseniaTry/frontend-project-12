 
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { addChannel, selectAllChannels } from "../slices/channelsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import * as yup from 'yup';

const ChannelModal = ({show, onHide}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const channels = useSelector(selectAllChannels)

  const schema = yup.object().shape({
    channelName: yup.string()
      .required('Обязательное поле')
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .test(
        '',
        "Должно быть уникальным",
        (value) => {
          return channels.every((channel) => channel.name !== value)
        }
      )
  })

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setError('')
             
      const newChannel = {
        name: values.channelName
      }

      try {
        await dispatch(addChannel(newChannel))
        setIsLoading(true)
        formik.resetForm()
      } catch(err) {
        setIsLoading(false)
        setError(`Ошибка сервера: ${err.message}. Перезагруите страницу`);
      } finally {
        setIsLoading(false)
      }
    },
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {t('channelModal.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit(e)
        }}>
          <Form.Group controlId="channelName">
            <Form.Control 
              type='text' 
              onChange={formik.handleChange}
              value={formik.values.channelName}
              required></Form.Control>
            {formik.touched.channelName && formik.errors.channelName ? (
              <div className="text-danger small mt-1">{formik.errors.channelName}</div>
            ) : <div className="p-2 mt-2"></div>}
            <Form.Label></Form.Label>
          </Form.Group>
          {error ? <div>{error}</div> : null}
          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={onHide}>{t('channelModal.reset')}</Button>
            <Button variant='primary' type='submit' disabled={isLoading}>{t('channelModal.send')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ChannelModal