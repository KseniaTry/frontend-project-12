 
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { setDefaultChannelId, removeChannelFromServer } from '../slices/channelsSlice';
import { useRollbar } from '@rollbar/react';

const DeleteModal = ({ show, onHide, channel}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const rollbar = useRollbar()

  const handleDelete = async () => {
    try {
      await dispatch(removeChannelFromServer(channel.id)).unwrap()
      dispatch(setDefaultChannelId())
      localStorage.setItem('activeChannel', 1)
      toast.success(t('notifications.success.channelDelete'))
      onHide()
    } catch(err) {
      toast.error(t('errors.removeChannel'))
      rollbar.error(t('errors.removeChannel'), err);
    } 
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="deleteModal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="deleteModal">
          {t('channelModal.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('channelModal.delete', {channelName: channel.name})}
        <div className="d-flex gap-2 justify-content-end">
          <Button variant="secondary" onClick={handleDelete}>
            {t('delete')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteModal