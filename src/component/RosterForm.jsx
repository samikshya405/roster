import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaPlus } from "react-icons/fa";
import { IoIosTime } from "react-icons/io";
import { GiHotMeal } from "react-icons/gi";
import { FaCalendar } from "react-icons/fa";

import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaDotCircle } from "react-icons/fa";
import { postRoster } from "../utilis/axiosHelper";
import { toast } from "react-toastify";

const initialState = {
  staffName: "empty",
  startDate: "",
  endDate: "",
  startTime: "09:00",
  endTime: "17:00",
  department: "",
};
function RosterForm({ day, deptName, staffs, getRosterData }) {
  const [show, setShow] = useState(false);
  const [timeEntered, settimeEntered] = useState(true);
  const [showEndDate, setshowEnddate] = useState("");
  const [shiftData, setshiftData] = useState(initialState);
  const staffToSHow = staffs.filter((staff) => staff.department === deptName);

  const date = day.date.toString().slice(0, 10);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    console.log(day.date);
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
  let timeDiff =0
  const calculateTimeDiff =()=>{
    
    const {startTime, endTime} = shiftData
    if(startTime > endTime){
      timeDiff = (24-startTime) + endTime
      
    }else{
      timeDiff=endTime-startTime
    }

  }

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    if (name === "endTime") {
      const { startTime, endTime } = shiftData;
      // Split the times into hours and minutes
      const [hours1, minutes1] = startTime.split(":").map(Number);
      const [hours2, minutes2] = endTime.split(":").map(Number);
      if (hours2 < hours1 || (hours1 === hours2 && minutes2 < minutes1)) {
        const currentDate = new Date(day.date);

        // Add one day to the date
        currentDate.setDate(currentDate.getDate() + 1);

        // Format the updated date as desired
        const tomorrowDateString = currentDate.toDateString();
        console.log(tomorrowDateString);
        setshiftData({
          ...shiftData,
          [name]: value,
          endDate: tomorrowDateString,
        });
        setshowEnddate(tomorrowDateString);
      } else {
        setshiftData({ ...shiftData, [name]: value });
      }
    } else {
      setshiftData({ ...shiftData, [name]: value });
    }
    calculateTimeDiff()
  };
  const handleSubmit = async () => {
    console.log(shiftData);
    const response = await postRoster(shiftData);
    console.log(response.data.message);

    toast.success(`Shift added to ${shiftData.staffName}`);
    getRosterData();
    setShow(false);
  };
  useEffect(() => {
    setshiftData({
      ...shiftData,
      department: deptName,
      startDate: day.date.toString().slice(0, 15),
      endDate: day.date.toString().slice(0, 15),
    });
  }, []);
  return (
    <>
      <FaPlus role="button" onClick={handleShow} />

      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Select
              name="staffName"
              onChange={handleSelectChange}
              required
            >
              <option value="empty">Empty Shift</option>
              <option value="empty">
                Empty Shift ( assigned it to somene later)
              </option>

              {staffToSHow?.map((staff, i) => (
                <option value={staff.fName} key={i}>
                  {staff.fName}
                </option>
              ))}
            </Form.Select>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {staffToSHow.some((staff) => staff.department === deptName) ? null : (
            <p className="text-warning">
              No staff has been assigned to this department yet
            </p>
          )}

          <p className="text-muted d-flex gap-3">
            <FaCalendar /> {date}
            {showEndDate && <>-{showEndDate}</>}
          </p>
          <p className="d-flex gap-3 align-items-center">
            <IoIosTime />
            <Form.Select
              aria-label="Default select example"
              style={{ width: "fit-content" }}
              name="startTime"
              value={shiftData.startTime}
              onChange={handleSelectChange}
            >
              {timeOptions.map((time, i) => (
                <option key={i} value={time.timeValue}>
                  {time.displayText}
                </option>
              ))}
            </Form.Select>
            -
            <Form.Select
              style={{ width: "fit-content" }}
              name="endTime"
              value={shiftData.endTime}
              onChange={handleSelectChange}
            >
              {timeOptions.map((time, i) => (
                <option key={i} value={time.timeValue}>
                  {time.displayText}
                </option>
              ))}
            </Form.Select>
          </p>
          {!timeEntered && (
            <p className="text-danger">
              Start time and end time cannot be same !
            </p>
          )}
          <p className="d-flex align-items-center gap-3">
            <FaDotCircle /> {deptName}
          </p>
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
              <RiDeleteBin6Fill />
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RosterForm;
