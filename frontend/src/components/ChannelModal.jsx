 
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { selectAllChannels, selectChannelById } from "../slices/channelsSlice";
import { useDispatch, useSelector } from "react-redux";
import Error from "./Error";
import initLeoProfanity from "../profanity";
import { useRollbar } from '@rollbar/react';
import { getChannelsSchema } from "../schemas";
import { handleChannelModalSubmit } from "../submits/channelModalSubmit.jsx";

const ChannelModal = ({ show, onHide, type}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const rollbar = useRollbar()
  const errorText = useSelector(state => state.channels?.errorText)
  const errorStatus = useSelector(state => state.channels?.errorStatus)
  const channels = useSelector(selectAllChannels)
  const schema = getChannelsSchema(t, channels)
  const activeChannelId = useSelector(state => state.channels.activeChannelId)
  const activeChannel = useSelector((state) => activeChannelId ? selectChannelById(state, activeChannelId) : null)
  const context = {activeChannelId, onHide, dispatch, rollbar, t}

  initLeoProfanity()

  const formik = useFormik({
    initialValues: {
      channelName: type === 'rename' ? activeChannel?.name : '',
    },
    validationSchema: schema,
    enableReinitialize: true, // нужно для того чтобы при переименовании отобразилось имя текущего канала (тк данные приходят не сразу)
    onSubmit: async (values, actions) => await handleChannelModalSubmit( values, actions, context, type)
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