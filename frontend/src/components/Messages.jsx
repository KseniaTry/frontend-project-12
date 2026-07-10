import { Button, Form, ListGroup } from "react-bootstrap"
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage, selectMessagesByChannel } from "../slices/messagesSlice";
import { selectChannelById } from "../slices/channelsSlice";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import filter from 'leo-profanity';
import { useRollbar } from "@rollbar/react";
import Error from "./Error";

const Messages = ({isSocketConnected}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const rollbar = useRollbar()
  const [value, setValue] = useState('')
  const sendingLoadingStatus = useSelector(state => state.messages.sendingLoadingStatus)
  const gettingLoadingStatus = useSelector(state => state.messages.gettingLoadingStatus)
  const isLoading = sendingLoadingStatus === 'loading'
  const activeChannelId = useSelector(state => state.channels.activeChannelId)
  const username = useSelector(state => state.auth.currentUsername)
  const activeChannel = useSelector(state => selectChannelById(state, activeChannelId))
  const messagesByChannel = useSelector(selectMessagesByChannel(activeChannelId))
  const messagesCount = messagesByChannel.length
  const messagesError = useSelector(state => state.messages?.errorText)
  const messagesEndRef = useRef(null)

  // для автоскролла к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesByChannel]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMessage = {
      body: filter.clean(value, '*', 1),
      channelId: activeChannelId,
      username: username
    }

    setValue('')

    try {
      await dispatch(sendMessage(newMessage)).unwrap()
    } catch(err) {
      toast.error(t('errors.messageSend'))
      rollbar.error(t('errors.messageSend'), err);
    } 

    messagesError ? toast.error(t('errors.messageSend')) : null
  }
    
  return(
    <div className="d-flex flex-column h-100" style={{ minHeight: 0 }}>
      <div className="flex-grow-0 flex-shrink-0 p-4 d-flex border-bottom border-secondary-subtle shadow-sm w-100 flex-column">
        <h2 className="h4"># {activeChannel?.name}</h2> 
        <p> {t('messages.messages', { count: messagesCount })}</p>
      </div>
      <div className="flex-grow-1 flex-shrink-1 p-4 bg-white w-100 overflow-auto">
        {isSocketConnected === false ? <Error error={t('errors.socket')} errorStatus={null}/> : null}
        {gettingLoadingStatus === 'loading'  && <p>{t('errors.loading')}</p>}
        <ListGroup as="ul">
          {messagesByChannel.map((message) => {
            return <ListGroup.Item
              className='border-0'
              key={message.id} as="li"
            >
              <b>{message.username}: </b>{message.body}
            </ListGroup.Item>
          })}
          <ListGroup.Item  className='border-0' ref={messagesEndRef}></ListGroup.Item>
        </ListGroup>
   
      </div>
      <div className="flex-grow-0 flex-shrink-0 p-4 w-100">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="message" className="d-flex gap-2">
            <Form.Control 
              name="message" 
              type="text" 
              value={value} 
              onChange={ e => setValue(e.target.value)} 
              placeholder={t('messages.placeholder')} 
              aria-label={t('messages.placeholder')}
              required
            />
            <Form.Label ></Form.Label>
            <Button type="submit" variant="primary" disabled={isLoading}>{t('messages.send')}</Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  )
}

export default Messages