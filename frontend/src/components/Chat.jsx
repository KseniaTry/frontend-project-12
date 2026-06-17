import { useDispatch, useSelector } from "react-redux"
import { useEffect} from "react";
import { getChannels } from "../slices/channelsSlice"
import { selectAllChannels } from "../slices/channelsSlice"
import { Container } from 'react-bootstrap';
import Channels from './Channels';

const Chat = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getChannels())
  }, [dispatch])

  const channels = useSelector(selectAllChannels)
  // console.log(channels)
  const {loadingStatus} = useSelector(state => state.channels)
  
  return(
    <Container>
      {loadingStatus === 'loading' && <p>Loading...</p>}
      <p>Это чат</p>
      <Channels channels={channels} />
    </Container>
  )
}

export default Chat