import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaPlus } from "react-icons/fa";
import { IoIosTime } from "react-icons/io";
import { GiHotMeal } from "react-icons/gi";
import { FaCalendar } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";

import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaDotCircle } from "react-icons/fa";
import { postRoster } from "../utilis/axiosHelper";
import { toast } from "react-toastify";
import { compareDate, generateTimeOptions } from "./date";

const initialState = {
  staffName: "empty",
  startDate: "",
  endDate: "",
  startTime: "09:00",
  endTime: "17:00",
  department: "",
};
function RosterForm({ day, deptName, staffs, getRosterData, rosterData }) {
  const [show, setShow] = useState(false);
  const [timeEntered, settimeEntered] = useState(true);
  const [showEndDate, setshowEnddate] = useState("");
  const [overLapped, setOverLapped] = useState(false);
  const [shiftData, setshiftData] = useState(initialState);
  const staffToSHow = staffs.filter((staff) => staff.department === deptName);

  const date = day.date.toString().slice(0, 10);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const startDate = day.date;
    startDate.setHours(9);
    startDate.setMinutes(0);

    const endDate = day.date;
    endDate.setHours(17);
    endDate.setMinutes(0);

   

    setshiftData({
      ...shiftData,
      department: deptName,
      startDate,
      endDate,
    });
  }, []);

  const timeOptions = generateTimeOptions();

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setOverLapped(false);

    if (name === "startTime" || name === "endTime") {
      updateShiftTime(name, value);
    } else {
      setshiftData({ ...shiftData, [name]: value });
    }
  };

  const updateShiftTime = (name, value) => {
    let { startTime, endTime } = shiftData;
    const currentDate = new Date(day.date);
    let startDate = new Date(day.date);
    let endDate = new Date(day.date);

    if (name === "startTime") {
      startTime = value;
    } else {
      endTime = value;
    }
    const [hours1, minutes1] = startTime.split(":").map(Number);
    const [hours2, minutes2] = endTime.split(":").map(Number);

    if (name === "startTime") {
      startDate.setHours(hours1);
      startDate.setMinutes(minutes1);
    } else {
      endDate.setHours(hours2);
      endDate.setMinutes(minutes2);
    }

    if (hours2 < hours1 || (hours1 === hours2 && minutes2 < minutes1)) {
      endDate.setDate(currentDate.getDate() + 1);
      const tommorrow = currentDate;
      tommorrow.setDate(currentDate.getDate() + 1);
      setshowEnddate(tommorrow.toString().slice(0, 10));
    }

    setshiftData({
      ...shiftData,
      [name]: value,
      startDate,
      endDate,
    });
  };

  const handleSubmit = async () => {
    console.log(shiftData);
    const shiftDate = new Date(shiftData.startDate).toISOString().split("T")[0];
    const shiftEndDate = new Date(shiftData.endDate)
      .toISOString()
      .split("T")[0];

    const filteredRosterData = rosterData?.filter((item) => {
      return (
        (compareDate(item?.startDate, shiftData.startDate) ||
          compareDate(item?.endDate, shiftData.startDate) ||
          compareDate(item?.startDate, shiftData.endDate) ||
          compareDate(item?.startDate, shiftData.endDate)) &&
        item?.staffName !== "empty" &&
        item?.staffName === shiftData.staffName
      );
    });
    console.log(filteredRosterData);
    let canAddShift = true;
    const newShiftStart = new Date(`${shiftDate}T${shiftData.startTime}`);

    const newShiftEnd = new Date(`${shiftEndDate}T${shiftData.endTime}`);

    filteredRosterData?.forEach((item) => {
      const existingShiftStart = new Date(
        `${new Date(item.startDate).toISOString().split("T")[0]}T${
          item.startTime
        }`
      );
      const existingShiftEnd = new Date(
        `${new Date(item.endDate).toISOString().split("T")[0]}T${item.endTime}`
      );

      if (compareDate(item.startDate, day.date)) {
        if (
          (newShiftStart >= existingShiftStart &&
            newShiftStart < existingShiftEnd) || // Case 1: New shift starts during existing shift
          (newShiftEnd > existingShiftStart &&
            newShiftEnd <= existingShiftEnd) || // Case 2: New shift ends during existing shift
          (newShiftStart <= existingShiftStart &&
            newShiftEnd >= existingShiftEnd) // Case 3: New shift fully overlaps existing shift
        ) {
          canAddShift = false;
        }
      } else {
        if (newShiftStart < existingShiftEnd) {
          canAddShift = false;
        }
      }
    });

    if (!canAddShift) {
      setOverLapped(true);
      return;
    }

    const response = await postRoster(shiftData);

    toast.success(`Shift added to ${shiftData.staffName}`);
    getRosterData();
    setShow(false);
  };

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
          {overLapped && (
            <p className="text-danger">
              This team member has an overlapping shift <CgDanger />
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
            <GiHotMeal /> Half hr meal break(unpaid)
          </p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div>
            <p className="p-0 m-0 text-muted">Total</p>
            <p className="fw-bold">7h 30min</p>
          </div>

          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RosterForm;
