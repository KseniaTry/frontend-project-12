
import { ListGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveChannelId } from '../slices/channelsSlice';
import { selectAllChannels } from '../slices/channelsSlice';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import ChannelModal from './ChannelModal';

const Channels = () => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const channels = useSelector(selectAllChannels)
  const [modalShow, setModalShow] = useState(false);
  const activeChannelId = useSelector(state => state.channels.activeChannelId)

  return(
    <>
      <div className='bg-light rounded text-dark h-100'>
        <div className='d-flex justify-content-between align-items-center mb-2'>
          <h2 className='h4'>{t('channels.title')}</h2>
          <Button variant="primary" size="sm" onClick={() => setModalShow(true)}>+</Button>
        </div>
        <div>
          <ListGroup as="ul">
            {channels.map((channel) => {
              const isActive = activeChannelId === channel.id

              return <ListGroup.Item 
                key={channel.id} as="li"
                onClick={() =>  dispatch(setActiveChannelId(channel.id))} 
                active={isActive}>
                # {channel.name}
              </ListGroup.Item>
            })}
          </ListGroup>
        </div>
      </div>
      <ChannelModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  )
}

export default Channels
 
      