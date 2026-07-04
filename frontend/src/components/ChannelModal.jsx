 
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { addChannel, selectAllChannels, editChannel, selectChannelById } from "../slices/channelsSlice";
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup';
import Error from "./Error";
import { toast } from "react-toastify";
import initLeoProfanity from "../profanity";
import filter from 'leo-profanity'
import { useRollbar } from '@rollbar/react';

const ChannelModal = ({ show, onHide, type}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const rollbar = useRollbar()
  const error = useSelector(state => state.channels?.errorText)
  const channels = useSelector(selectAllChannels)
  const activeChannelId = useSelector(state => state.channels.activeChannelId)
  const activeChannel = useSelector((state) => {
    if (activeChannelId)  {
      return  selectChannelById(state, activeChannelId)
    } else {
      return null
    }
  })

  initLeoProfanity()

  const schema = yup.object().shape({
    channelName: yup.string()
      .min(3, t('validation.nameLength'))
      .max(20, t('validation.nameLength'))
      .test(
        '',
        t('validation.unique'),
        (value) => {
          return channels.every((channel) => channel.name !== value)
        }
      )
      .required(t('validation.required'))
  })

  const handleAddChannel = async (newChannel) => {
    try {
      const response = await dispatch(addChannel(newChannel)).unwrap()
      localStorage.setItem('activeChannel', response.id);
      toast.success(t('notifications.success.channelAdd'));
      return true // нужно для закрытия модалки и для сброса формы только в случае успешной обработки запроса
    } catch(err) {
      toast.error(t('errors.channelAdd'))
      rollbar.error(t('errors.channelAdd'), err);
      return false 
    }
  };

  const handleRenameChannel = async (activeChannelId, newChannel) => {
    try {
      await dispatch(editChannel({ channelId: activeChannelId, editedChannel: newChannel })).unwrap()
      toast.success(t('notifications.success.channelRename'));
      return true
    } catch(err) {
      toast.error(t('errors.channelRename'))
      rollbar.error(t('errors.channelRename'), err);
      return false 
    }
  };

  const formik = useFormik({
    initialValues: {
      channelName: type === 'rename' ? activeChannel?.name : '',
    },
    validationSchema: schema,
    enableReinitialize: true, // нужно для того чтобы при переименовании отобразилось имя текущего канала (тк данные приходят не сразу)
    onSubmit: async (values, {setSubmitting}) => {     
      const newChannel = {
        name: filter.clean(values.channelName, '*', 1)
      }

      let isSuccess = false

      switch (type) {
        case 'add':
          isSuccess = await handleAddChannel(newChannel)
          break
        case 'rename':
          isSuccess = await handleRenameChannel(activeChannelId, newChannel)
          break
        default: 
          console.log('type not exist')
          break
      }
  
      if (isSuccess) {
        formik.resetForm()
        onHide()
      }
  
      setSubmitting(false);
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
          {type === 'add' ? t('channelModal.addTitle') : t('channelModal.renameTitle')}
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
              isInvalid={formik.touched.channelName && formik.errors.channelName}
              onBlur={formik.handleBlur}
              required
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.channelName}
            </Form.Control.Feedback>
            <Form.Label></Form.Label>
          </Form.Group>
          {error ? <Error error={error}/> : null}
          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={onHide}>
              {t('channelModal.reset')}
            </Button>
            <Button variant='primary' type='submit' disabled={formik.isSubmitting}>
              {t('channelModal.send')} 
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ChannelModal