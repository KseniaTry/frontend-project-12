
import { ListGroup, Container } from 'react-bootstrap';

const Channels = ({channels}) => {
  return(
    <Container>
      <ListGroup as="ul">
        {channels.map((channel) => {
          return <ListGroup.Item key={channel.id} as="li">{channel.name}</ListGroup.Item>
        })}
      </ListGroup>
    </Container>
  )
}

export default Channels
 
      