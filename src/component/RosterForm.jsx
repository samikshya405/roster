import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaPlus } from "react-icons/fa";
import { IoIosTime } from "react-icons/io";
import { GiHotMeal } from "react-icons/gi";
import { FaCalendar } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaDotCircle } from "react-icons/fa";

function RosterForm({ day,department,staffs }) {
  const [show, setShow] = useState(false);

  const date = day.date.toString().slice(0, 10);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    console.log(date);
  };

  // Function to pad single digit numbers with leading zeros
  const pad = (num) => {
    return (num < 10 ? "0" : "") + num;
  };

  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (minute % 15 === 0) {
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour < 12 ? "AM" : "PM";
        const timeValue = `${pad(hour)}:${pad(minute)}`;
        const displayText = `${pad(displayHour)}:${pad(minute)} ${period}`;
        timeOptions.push({ timeValue, displayText });
      }
    }
  }

  return (
    <>
      <FaPlus role="button" onClick={handleShow} />

      <Modal show={show} onHide={handleClose} animation={false} centered backdrop="static"
        keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Select aria-label="Default select example">
              <option>Empty Shift</option>
              {
                staffs.map((staff,i)=>(
                  <option value={staff.firstName} key={i}>{staff.firstName}</option>
                ))
              }
            </Form.Select>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted d-flex gap-3">
            <FaCalendar /> {date}{" "}
          </p>
          <p className="d-flex gap-3 align-items-center">
            <IoIosTime />
            <Form.Select
              aria-label="Default select example"
              style={{ width: "fit-content" }}
              value={"09:00"}
            >
              {timeOptions.map((time, i) => (
                <option key={i} value={time.timeValue}>
                  {time.displayText}
                </option>
              ))}
            </Form.Select>
            -
            <Form.Select style={{ width: "fit-content" }} value={"17:00"}>
              {timeOptions.map((time, i) => (
                <option key={i} value={time.timeValue}>
                  {time.displayText}
                </option>
              ))}
            </Form.Select>
          </p>
          <p className="d-flex align-items-center gap-3"><FaDotCircle/> {department}</p>
          <p className="d-flex gap-3">
            {" "}
            <GiHotMeal /> Half hr paid meal break(unpaid)
          </p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div>
          <p className="p-0 m-0 text-muted">Total</p>
          <p className="fw-bold">7h 30min</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="danger">
              <RiDeleteBin6Fill/>
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RosterForm;
