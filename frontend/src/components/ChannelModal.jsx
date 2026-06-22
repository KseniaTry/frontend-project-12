 
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { addChannel } from "../slices/channelsSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

const ChannelModal = ({show, onHide}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
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
        console.log(err)
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
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="channelName">
            <Form.Control 
              type='text' 
              onChange={formik.handleChange}
              value={formik.values.channelName}
              required></Form.Control>
            <Form.Label></Form.Label>
          </Form.Group>
          {error ? <div>{error}</div> : null}
          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={onHide}>{t('channelModal.reset')}</Button>
            <Button variant='primary' type='submit' onClick={onHide} disabled={isLoading}>{t('channelModal.send')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ChannelModal