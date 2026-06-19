
import { ListGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveChannel } from '../slices/channelsSlice';

const Channels = ({channels}) => {
  const dispatch = useDispatch()
  const activeChannel = useSelector(state => state.channels.activeChannel)

  return(
    <div className='bg-light rounded text-dark h-100'>
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h2 className='h4'>Каналы</h2>
        <Button variant="primary" size="sm">+</Button>
      </div>
      <div>
        <ListGroup as="ul">
          {channels.map((channel) => {
            const isActive = activeChannel === channel.name

            return <ListGroup.Item 
              key={channel.id} as="li"
              onClick={() =>  dispatch(setActiveChannel(channel.name))} 
              active={isActive}>
              {channel.name}
            </ListGroup.Item>
          })}
        </ListGroup>
      </div>
    </div>
  )
}

export default Channels
 
      