import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState} from "react";
import { getChannels } from "../slices/channelsSlice"
import { selectAllChannels, setActiveChannelId } from "../slices/channelsSlice"
import { Container, Row, Col } from 'react-bootstrap';
import { socket } from '../socket';
import Channels from './Channels';
import Messages from "./Messages";
import Header from "./Header";
import { getMessages, selectAllMessages, addMessage } from "../slices/messagesSlice";

const Chat = () => {
  const dispatch = useDispatch()
  const channels = useSelector(selectAllChannels)
  const messages = useSelector(selectAllMessages)
  const activeChannelId = useSelector(state => state.channels.activeChannelId)
  const {loadingStatus} = useSelector(state => state.channels)
  const [isSocketConnected, setSocketIsConnected] = useState(socket.connected);

  // загружаем исходные данные единожды
  useEffect(() => {
    dispatch(getChannels())
    dispatch(getMessages())
  }, [dispatch])

  // один раз присваиваем id с выбранным каналом (только при условии что каналы загрузились)
  useEffect(() => {
    if (channels.length > 0 && !activeChannelId) {
      const defaultActiveChannel = channels.find((channel) => channel.name === 'general');
      if (defaultActiveChannel) {
        dispatch(setActiveChannelId(defaultActiveChannel.id));
      }
    }
  }, [channels, dispatch, activeChannelId]);

  useEffect(() => {
    function onConnect() {
      setSocketIsConnected(true);
    }

    function onDisconnect() {
      setSocketIsConnected(false);
    }

    function onNewMessage(payload) {
      console.log('сокет-сообщение:', payload);
      dispatch(addMessage(payload)) // так как метод addOne сам проверяет наличие дублей по id, поэтому такая проверка не нужна
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newMessage', onNewMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('newMessage', onNewMessage);
    };
  }, [dispatch, messages]);

  return(
    <Container fluid className="border vh-100 p-0 d-flex flex-column bg-body-secondary">
      <Header />
      <Row className="flex-grow-1 m-4 bg-light border-light-subtle rounded-3 shadow" style={{ minHeight: 0 }}>
        <Col xs={4} md={4} className="p-4 border-end border-secondary-subtle h-100 d-flex flex-column" style={{ minHeight: 0 }}>
          {loadingStatus === 'loading' && <p>Loading channels...</p>}
          <Channels />
        </Col>
        <Col xs={8} md={8} className="h-100 d-flex flex-column p-0" style={{ minHeight: 0 }}>
          <Messages isConnected={isSocketConnected}/>
        </Col>
      </Row>
  
    </Container>
  )
}

export default Chat