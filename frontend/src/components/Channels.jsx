
import { ListGroup, Button, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveChannelId,  setDefaultChannelId, removeChannelFromServer, selectAllChannels } from '../slices/channelsSlice';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import ChannelModal from './ChannelModal';
import { selectAllMessages } from '../slices/messagesSlice';

const DropdownChannel = ({channel, isActive}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')

  const handleClick = async () => {
    try {
      await dispatch(removeChannelFromServer(channel.id))
      dispatch(setDefaultChannelId())
      setIsLoading(true)
    } catch(err) {
      setIsLoading(false)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dropdown className='d-grid w-100'>
      <Dropdown.Toggle variant='secondary' id="dropdown-channel" className={`d-flex align-items-center justify-content-between w-100 text-start bg-transparent p-0 border-0 shadow-none ${isActive ? 'text-white' : 'text-dark'}`}>
        # {channel.name}
        {/* должна быть модалка с ошибкой ! */}
        {error ? <div>{error}</div> : null} 
      </Dropdown.Toggle>

      <Dropdown.Menu className='w-100'>
        <Dropdown.Item as='button' onClick={handleClick} disabled={isLoading}>{t('delete')}</Dropdown.Item>
        <Dropdown.Item as='button'>{t('rename')}</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

const Channels = () => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const channels = useSelector(selectAllChannels)
  const [modalShow, setModalShow] = useState(false);
  const activeChannelId = useSelector(state => state.channels.activeChannelId)

  return(
    <>
      <div className=' d-flex flex-column bg-light rounded text-dark h-100'>
        <div className='d-flex justify-content-between align-items-center mb-2'>
          <h2 className='h4'>{t('channels.title')}</h2>
          <Button variant="primary" size="sm" onClick={() => setModalShow(true)}>+</Button>
        </div>
        <div className='overflow-auto'>
          <ListGroup as="ul" className='bg-transparent'>
            {channels.map((channel) => {
              const isActive = activeChannelId === channel.id

              return <ListGroup.Item 
                className={`border-0 ${isActive ? '': 'bg-transparent'}`}
                key={channel.id} as="li"
                onClick={() =>  dispatch(setActiveChannelId(channel.id))} 
                variant={isActive ? 'light' : ''} 
                active={isActive}>
                {channel.removable ? 
                  <DropdownChannel channel={channel} isActive={isActive}></DropdownChannel> : 
                  <span># {channel.name}</span>}
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
 
      