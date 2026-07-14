import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState} from "react";
import { getChannels } from "../slices/channelsSlice"
import { addNewChannel, removeChannel, renameChannel } from "../slices/channelsSlice"
import { Container, Row, Col } from 'react-bootstrap';
import { socket } from '../socket';
import Channels from '../components/Channels';
import Messages from "../components/Messages";
import Header from "../components/Header";
import { getMessages, addMessage } from "../slices/messagesSlice";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useRollbar } from '@rollbar/react';

const Chat = () => {
  const dispatch = useDispatch()
  const rollbar = useRollbar()
  const [isSocketConnected, setSocketIsConnected] = useState(!!socket.connected)
  const {t} = useTranslation()
  const channelsErrorStatus = useSelector(state => state.channels?.errorStatus)
  const messagesErrorStatus = useSelector(state => state.messages?.errorStatus)
  const channelsErrorText = useSelector(state => state.channels?.errorText)
  const messagesErrorText = useSelector(state => state.messages?.errorText)

  // загружаем исходные данные единожды
  useEffect(() => {
    dispatch(getChannels());
    dispatch(getMessages());
  }, [dispatch]);

  // следим за ошибками из слайса
  useEffect(() => {
    if (channelsErrorStatus) {
      toast.error(t('errors.channelsLoading'));
      rollbar.error(t('errors.channelsLoading'), {
        status: channelsErrorStatus, // отдельно передаем статус и текст ошибки так как не используется блок catch при диспатче каналов
        message: channelsErrorText,
      });
    }
  }, [channelsErrorText, channelsErrorStatus, t, rollbar]);

  useEffect(() => {
    if (messagesErrorStatus) {
      toast.error(t('errors.messagesLoading'));
      rollbar.error(t('errors.messagesLoading'), {
        status: messagesErrorStatus, 
        message: messagesErrorText,
      });
    }
  }, [messagesErrorText, messagesErrorStatus, t, rollbar]);

  // сокет подписки 
  useEffect(() => {
    socket.connect()
        
    function onConnect() {
      setSocketIsConnected(true);
    }

    function onDisconnect() {
      setSocketIsConnected(false);
    }

    function onNewMessage(payload) {
      dispatch(addMessage(payload)) // так как метод addOne сам проверяет наличие дублей по id, поэтому такая проверка не нужна
    }

    function onNewChannel(payload) {
      dispatch(addNewChannel(payload))
    }

    function onRemoveChannel(payload) {
      dispatch(removeChannel(payload.id))
    }

    function onRenameChannel(payload) {
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