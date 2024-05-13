import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IoMdAddCircle } from "react-icons/io";

function AddTeamMember({department}) {
  const [show, setShow] = useState(false);
  const [formData, setformData] = useState({})

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit=(e)=>{
    e.preventDefault()

  }

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
         <Form onSubmit={handleSubmit}>
         <Form.Label>Select Department</Form.Label>
         <Form.Select aria-label="Default select example">
            {
              department.map((dept,i)=>(
                <option key={i} value={dept.name}>{dept.name}</option>
              ))
            }
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
          <div className='text-center m-3'>
          <Button  variant="primary" type='submit'>Add Team Member</Button>
          </div>
           
         </Form>
        </Modal.Body>
        
      </Modal>
    </>
  );
}

export default AddTeamMember;