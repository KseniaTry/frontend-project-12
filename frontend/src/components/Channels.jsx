
import { ListGroup, Button } from 'react-bootstrap';
import DropdownChannel from './DropdownChannel';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveChannelId, selectAllChannels } from '../slices/channelsSlice';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import ChannelModal from './ChannelModal';

const Channels = () => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const channels = useSelector(selectAllChannels)
  const [modalShow, setModalShow] = useState(false);
  const activeChannelId = useSelector(state => state.channels.activeChannelId)

  const handleClickChannel = (channelId) => {
    dispatch(setActiveChannelId(channelId))
    localStorage.setItem('activeChannel', channelId)
  }

  return(
    <>
      <div className=' d-flex flex-column bg-light rounded text-dark h-100'>
        <div className='d-flex justify-content-between align-items-center mb-2'>
          <h2 className='h4'>{t('channels.title')}</h2>
          <Button variant="primary" size="sm" onClick={() => setModalShow(true)}>{t('addButton')}</Button>
        </div>
        <div className='overflow-auto'>
          <ListGroup as="ul" className='bg-transparent'>
            {channels.map((channel) => {
              const isActive = activeChannelId === channel.id

              return <ListGroup.Item 
                className={`border-0 ${isActive ? '': 'bg-transparent'}`}
                key={channel.id} as="li"
                onClick={() => handleClickChannel(channel.id)} 
                variant={isActive ? 'light' : ''} 
                active={isActive}>
                {channel.removable ? 
                  <DropdownChannel handleClickChannel={handleClickChannel} channel={channel} isActive={isActive}></DropdownChannel> : 
                  <span># {channel.name}</span>}
              </ListGroup.Item>
            })}
          </ListGroup>
        </div>
      </div>
      <ChannelModal show={modalShow} onHide={() => setModalShow(false)} type='add' />
    </>
  )
}
export default Channels
 
      