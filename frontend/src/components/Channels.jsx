
import { ListGroup, Button } from 'react-bootstrap';

const Channels = ({channels}) => {
  return(
    <div className='bg-light rounded text-dark h-100'>
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h2 className='h4'>Каналы</h2>
        <Button variant="primary" size="sm">+</Button>
      </div>
      <div>
        <ListGroup as="ul">
          {channels.map((channel) => {
            return <ListGroup.Item key={channel.id} as="li">{channel.name}</ListGroup.Item>
          })}
        </ListGroup>
      </div>
    </div>
  )
}

export default Channels
 
      