import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaPlus } from "react-icons/fa";
import { IoIosTime } from "react-icons/io";

import { FaCalendar } from "react-icons/fa";

function RosterForm({ day }) {
  const [show, setShow] = useState(false);

  const date = day.date.toString().slice(0, 10);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    console.log(date);
  };

  return (
    <>
      <FaPlus role="button" onClick={handleShow} />

      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Select aria-label="Default select example">
              <option>Empty Shift</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </Form.Select>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">
            <FaCalendar /> {date}{" "}
          </p>
          <p>
            <IoIosTime/> 09:00 AM-05:00 PM
          </p>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
          <Button variant="primary" onClick={handleClose}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RosterForm;
