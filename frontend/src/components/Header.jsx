import { Button, Navbar, Container } from "react-bootstrap"

const Header = () => {
  return(
    <Navbar bg="white" variant="white" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">Hexlet Chat</Navbar.Brand>
        
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Button variant="outline-light" size="sm">Выйти</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header