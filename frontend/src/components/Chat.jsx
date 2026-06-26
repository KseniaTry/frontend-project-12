import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState} from "react";
import { getChannels } from "../slices/channelsSlice"
import { selectAllChannels, setDefaultChannelId, addNewChannel, removeChannel, renameChannel } from "../slices/channelsSlice"
import { Container, Row, Col } from 'react-bootstrap';
import { socket } from '../socket';
import Channels from './Channels';
import Messages from "./Messages";
import Header from "./Header";
import { getMessages, addMessage } from "../slices/messagesSlice";

const Chat = () => {
  const dispatch = useDispatch()
  const {loadingStatus} = useSelector(state => state.channels)
  const [isSocketConnected, setSocketIsConnected] = useState(socket.connected);

  // загружаем исходные данные единожды
  useEffect(() => {
    dispatch(getChannels())
    dispatch(getMessages())
  }, [dispatch])

  // сокет подписки 
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

    function onNewChannel(payload) {
      console.log('сокет-новый канал: ', payload)
      dispatch(addNewChannel(payload))
    }

    function onRemoveChannel(payload) {
      console.log('удаление канала ', payload)
      dispatch(removeChannel(payload.id))
    }

    function onRenameChannel(payload) {
      console.log('переименование канала ', payload)
      dispatch(renameChannel(payload))
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newMessage', onNewMessage);
    socket.on('newChannel', onNewChannel);
    socket.on('removeChannel', onRemoveChannel);
    socket.on('renameChannel', onRenameChannel);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('newMessage', onNewMessage);
      socket.off('newChannel', onNewChannel);
      socket.off('removeChannel', onRemoveChannel);
      socket.off('renameChannel', onRenameChannel);
    };
  }, [dispatch]);

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