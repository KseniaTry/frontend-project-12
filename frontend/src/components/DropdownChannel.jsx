
import { useState } from "react";
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setDefaultChannelId, removeChannelFromServer } from '../slices/channelsSlice';
import { useTranslation } from 'react-i18next';
import ChannelModal from "./ChannelModal";
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

const DropdownChannel = ({handleClickChannel, channel, isActive}) => {
  const {t} = useTranslation()
  const rollbar = useRollbar()
  const dispatch = useDispatch()
  const [modalShow, setModalShow] = useState(false);

  const handleDelete = async () => {
    try {
      await dispatch(removeChannelFromServer(channel.id)).unwrap()
      dispatch(setDefaultChannelId())
      localStorage.setItem('activeChannel', 1)
      toast.success(t('notifications.success.channelDelete'))
    } catch(err) {
      toast.error(t('errors.removeChannel'))
      rollbar.error(t('errors.removeChannel'), err);
    } 
  }

  return (
    <>
      <Dropdown as={ButtonGroup} className='d-flex d-flex align-items-center justify-content-between w-100 mb-1'>
        <Button
          variant="secondary" 
          onClick={() => handleClickChannel(channel.id)} 
          className= {`text-start text-dark bg-transparent p-0 border-0 shadow-none w-100 ${isActive ? 'text-white' : 'text-dark'}`}>
          # {channel.name}
        </Button>
        <Dropdown.Toggle
          variant='secondary'
          id="dropdown-channel" 
          className={`bg-transparent p-0 border-0 shadow-none ${isActive ? 'text-white' : 'text-dark'}`}>
        </Dropdown.Toggle>

        <Dropdown.Menu className='w-100'>
          <Dropdown.Item as='button' 
            onClick={handleDelete}
          >
            {t('delete')}
          </Dropdown.Item>
          <Dropdown.Item as='button' 
            onClick={() => setModalShow(true)}>
            {t('rename')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <ChannelModal 
        show={modalShow} 
        onHide={() => setModalShow(false)} 
        type='rename'/>
    </>
  )
}

export default DropdownChannel