import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IoMdAddCircle } from "react-icons/io";

function AddTeamMember() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="py-4 ps-3" role="button" style={{fontSize:"14px"}} onClick={handleShow}>
        <IoMdAddCircle/> Add Team Member
         </div>
         <hr className="p-0 m-0" />
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <Form>
         <Form.Label>Select Department</Form.Label>
         <Form.Select aria-label="Default select example">
            <option>Receptionist</option>
         </Form.Select>

         <Form.Label>First Name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="first name"
            // defaultValue="Mark"
          />
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="last name"
            // defaultValue="Mark"
          />
          <Form.Label>Phone</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="optional"
            // defaultValue="Mark"
          />
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="abc@gmail.com"
            // defaultValue="Mark"
          />
         </Form>
        </Modal.Body>
        <Modal.Footer>
          
          <Button variant="primary">Add Team Member</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddTeamMember;