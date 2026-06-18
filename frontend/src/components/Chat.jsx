import { useDispatch, useSelector } from "react-redux"
import { useEffect} from "react";
import { getChannels } from "../slices/channelsSlice"
import { selectAllChannels } from "../slices/channelsSlice"
import { Container, Row, Col } from 'react-bootstrap';
import Channels from './Channels';
import Messages from "./Messages";
import Header from "./Header";

const Chat = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getChannels())
  }, [dispatch])

  const channels = useSelector(selectAllChannels)
  // console.log(channels)
  const {loadingStatus} = useSelector(state => state.channels)
  
  return(
    <Container fluid className="border vh-100 p-0 d-flex flex-column bg-body-secondary">
      <Header />
      <Row className="flex-grow-1 m-4 bg-light border-light-subtle rounded-3 shadow" style={{ minHeight: 0 }}>
        <Col xs={4} md={4} className="p-4 border-end border-secondary-subtle h-100 d-flex flex-column" style={{ minHeight: 0 }}>
          {loadingStatus === 'loading' && <p>Loading channels...</p>}
          <Channels channels={channels} />
        </Col>
        <Col xs={8} md={8} className="h-100 d-flex flex-column p-0" style={{ minHeight: 0 }}>
          <Messages />
        </Col>
      </Row>
  
    </Container>
  )
}

export default Chat