import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { postDepartment } from "../utilis/axiosHelper";
import { toast } from "react-toastify";

function AddNewArea({getDepartmentList}) {
  const [show, setShow] = useState(false);
  const [deptName, setdeptName] = useState('')

  const handleChange=(e)=>{
    setdeptName(e.target.value)
  }

  const handleAdd=async()=>{
    if(deptName===""){
      return 
    }
    const response = await postDepartment({name:deptName})
    getDepartmentList()
    setShow(false)
    toast.success("New area has been added")

  }

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
            value={deptName}
            onChange={handleChange}
            // defaultValue="Mark"
          />
        </Modal.Body>
        <Modal.Footer>
         
          <Button variant="primary" onClick={handleAdd}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddNewArea;
