import { Button, Form, ListGroup } from "react-bootstrap"
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage, selectMessagesByChannel } from "../slices/messagesSlice";
import { selectChannelById } from "../slices/channelsSlice";
import { useTranslation } from "react-i18next";

// пример сообщения
// const newMessage = { body: 'new message', channelId: '1', username: 'admin }; 

const Messages = ({isSocketConnected}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')
  const activeChannelId = useSelector(state => state.channels.activeChannelId)
  const username = useSelector(state => state.auth.username)
  const activeChannel = useSelector(state => selectChannelById(state, activeChannelId))
  const messagesByChannel = useSelector(selectMessagesByChannel(activeChannelId))
  const messagesCount = messagesByChannel.length

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMessage = {
      body: value,
      channelId: activeChannelId,
      username: username
    }

    try {
      await dispatch(sendMessage(newMessage))
      setValue('')
      setIsLoading(true)
    } catch(err) {
      setIsLoading(false)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
    
  return(
    <div className="d-flex flex-column h-100" style={{ minHeight: 0 }}>
      <div className="flex-grow-0 flex-shrink-0 p-4 d-flex border-bottom border-secondary-subtle shadow-sm w-100 flex-column">
        <h2 className="h4"># {activeChannel?.name}</h2> 
        <p> {t('messages.messages', { count: messagesCount })}</p>
      </div>
      <div className="flex-grow-1 flex-shrink-1 p-4 bg-white w-100 overflow-auto">
        {error ? <div>{error}</div> : null}
        {isSocketConnected ? <div>{t('messages.errorSocket')}</div> : null}
        <ListGroup as="ul">
          {messagesByChannel.map((message) => {
            return <ListGroup.Item
              className='border-0'
              key={message.id} as="li"
            >
              <b>{message.username}: </b>{message.body}
            </ListGroup.Item>
          })}

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