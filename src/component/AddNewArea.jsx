import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function AddNewArea() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div>
        <Button className="w-100" variant="primary" onClick={handleShow}>
          Add New Area
        </Button>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Area</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Label>Area name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Receptionist"
            // defaultValue="Mark"
          />
        </Modal.Body>
        <Modal.Footer>
         
          <Button variant="primary">Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddNewArea;
