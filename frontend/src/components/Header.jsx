import { Button, Navbar, Container } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setAuthStatus, setCurrentUsername, setToken } from "../slices/authSlice"

const Header = () => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isAuth = useSelector(state => state.auth.isAuth)

  const handleClick = () => {
    dispatch(setAuthStatus(false))
    dispatch(setCurrentUsername(''))
    dispatch(setToken(''))
    localStorage.removeItem('userToken')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return(
    <Container fluid className="vw=100 p-0">
      <Navbar bg="white" variant="white" className="sticky-top px-5 py-3">
    
        <Navbar.Brand className="fs-3" href="/">{t('header.title')}</Navbar.Brand>
        
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Button variant="primary" size="sm" onClick={handleClick}>{isAuth ? t('logout') : t('login')}</Button>
        </Navbar.Collapse>
   
      </Navbar>
    </Container>

  )
}

export default Header