import { Button, Form } from "react-bootstrap"

const Messages = () => {
//   const handleChange = () => {

  //   }
    
  return(
    <div className="d-flex flex-column h-100" style={{ minHeight: 0 }}>
      <div className="flex-grow-0 flex-shrink-0 p-4 d-flex border-bottom border-secondary-subtle shadow-sm w-100 flex-column">
        <h2 className="h4">Наименование канала</h2> 
        <p> кол-во сообщений</p>
      </div>
      <div className="flex-grow-1 flex-shrink-1 p-4 bg-white w-100">
        сообщения
      </div>
      <div className="flex-grow-0 flex-shrink-0 p-4 w-100 overflow-auto">
        <Form.Group controlId="message">
          {/* <Form.Control name="message" type="text" value='' onChange={handleChange} placeholder="Введние сообщение..."> </Form.Control> */}
          {/* <Form.Label ></Form.Label> */}
          <Button type="submit" variant="primary"></Button>
        </Form.Group>
      </div>
    </div>
  )
}

export default Messages