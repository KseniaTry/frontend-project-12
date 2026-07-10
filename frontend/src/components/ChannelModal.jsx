 
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { addChannel, selectAllChannels, editChannel, selectChannelById, setActiveChannelId } from "../slices/channelsSlice";
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
  const errorText = useSelector(state => state.channels?.errorText)
  const errorStatus = useSelector(state => state.channels?.errorStatus)
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
      .min(3, t('validation.length'))
      .max(20, t('validation.length'))
      .test(
        '',
        t('validation.unique'),
        (value) => {
          return channels.every((channel) => channel.name !== value)
        }
      )
  })

  const handleAddChannel = async (newChannel) => {
    try {
      const response = await dispatch(addChannel(newChannel)).unwrap()
      localStorage.setItem('activeChannel', response.id);
      dispatch(setActiveChannelId(response.id))
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
        name: filter.clean(values.channelName)
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
      aria-labelledby="channelModal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="channelModal">
          {type === 'add' ? t('channelModal.addTitle') : t('channelModal.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={ formik.handleSubmit}>
          <Form.Group controlId="channelName" className="mb-4">
            <Form.Label className="mb-3">
              { t('channelModal.label')}
            </Form.Label>
            <Form.Control 
              type='text' 
              onChange={formik.handleChange}
              value={formik.values.channelName}
              isInvalid={!!formik.errors.channelName}
              onBlur={formik.handleBlur}
              required
              autoFocus
            />

            <div className="invalid-feedback d-block" style={{ minHeight: '21px' }}>
              {formik.errors.channelName || ''}
            </div>

          </Form.Group>
          {errorText ? <Error error={errorText} errorStatus={errorStatus}/> : null}
          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={onHide}>
              {t('channelModal.reset')}
            </Button>
            <Button 
              variant='primary' 
              type='submit' 
              disabled={formik.isSubmitting}
            >
              {t('channelModal.send')} 
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ChannelModal