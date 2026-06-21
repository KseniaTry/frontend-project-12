import { Button, Form, ListGroup } from "react-bootstrap"
import { socket } from "../socket";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAllMessages, sendMessage, selectMessagesCountByChannel } from "../slices/messagesSlice";
import { selectChannelById } from "../slices/channelsSlice";

// пример сообщения
// const newMessage = { body: 'new message', channelId: '1', username: 'admin }; 

const Messages = ({isConnected}) => {
  const dispatch = useDispatch()
  const messages = useSelector(selectAllMessages)
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')
  const activeChannelId = useSelector(state => state.channels.activeChannelId)
  const username = useSelector(state => state.auth.username)
  const activeChannel = useSelector(state => selectChannelById(state, activeChannelId))
  const messagesCount = useSelector(selectMessagesCountByChannel(activeChannelId))

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
  
    // socket.timeout(5000).emit('newMessage', newMessage, () => {
    //   setIsLoading(false);
    // });
  }
    
  return(
    <div className="d-flex flex-column h-100" style={{ minHeight: 0 }}>
      <div className="flex-grow-0 flex-shrink-0 p-4 d-flex border-bottom border-secondary-subtle shadow-sm w-100 flex-column">
        <h2 className="h4"># {activeChannel?.name}</h2> 
        <p> {messagesCount} сообщения</p>
        {isConnected ? <div>Загрузка сообщений...</div> : null}
      </div>
      <div className="flex-grow-1 flex-shrink-1 p-4 bg-white w-100 overflow-auto">
        {error ? <div>{error}</div> : null}
        <ListGroup as="ul">
          {messages.map((message) => {
            return <ListGroup.Item
              key={message.id} as="li"
            >
              <b>{message.username}: </b>{message.body}
            </ListGroup.Item>
          })}

        </ListGroup>
   
      </div>
      <div className="flex-grow-0 flex-shrink-0 p-4 w-100">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="message" >
            <Form.Control 
              name="message" 
              type="text" 
              value={value} 
              onChange={ e => setValue(e.target.value)} 
              placeholder="Введние сообщение..." 
            />
            <Form.Label ></Form.Label>
            <Button type="submit" variant="primary" disabled={isLoading}>Отправить</Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  )
}

export default Messages