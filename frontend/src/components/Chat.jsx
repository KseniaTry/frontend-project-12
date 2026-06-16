import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('userToken');
  if (!token) {
    navigate('/login')
  }

  return(
    <div>Это чат</div>
  )
}

export default Chat