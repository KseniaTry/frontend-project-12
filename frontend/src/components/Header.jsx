import { Button, Navbar, Container } from "react-bootstrap"

const Header = () => {
  return(
    <Container fluid className="vw=100 p-0">
      <Navbar bg="white" variant="white" className="sticky-top px-5 py-3">
    
        <Navbar.Brand className="fs-3" href="/">Hexlet Chat</Navbar.Brand>
        
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Button variant="primary" size="sm">Выйти</Button>
        </Navbar.Collapse>
   
      </Navbar>
    </Container>

  )
}

export default Header