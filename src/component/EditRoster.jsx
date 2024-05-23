import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { IoIosTime } from "react-icons/io";
import { GiHotMeal } from "react-icons/gi";
import { FaCalendar } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { FaDotCircle } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { compareDate, generateTimeOptions } from "./date";
import { deleteRoster, updateRoster } from "../utilis/axiosHelper";
import { toast } from "react-toastify";
import { Draggable } from "react-beautiful-dnd";

function EditRoster({ item, itemIndex, staffs, rosterData, getRosterData }) {
  const [show, setShow] = useState(false);
  const [showEndDate, setshowEndDate] = useState("");
  const staffToSHow = staffs.filter(
    (staff) => staff.department === item.department
  );
  const date = new Date(item.startDate).toDateString().slice(0, 10);
  const [shiftData, setShiftData] = useState({ ...item });
  const timeOptions = generateTimeOptions();

  const [timeEntered, settimeEntered] = useState(true);
  const [overLapped, setOverLapped] = useState(false);

  useEffect(() => {
    if (!compareDate(item.startDate, item.endDate)){
      setshowEndDate(new Date(item.endDate).toDateString().slice(0, 10))
    }
      
  }, []);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setOverLapped(false);

    if (name === "startTime" || name === "endTime") {
      updateShiftTime(name, value);
    } else {
      setShiftData({ ...shiftData, [name]: value });
    }
  };

  const updateShiftTime = (name, value) => {
    let { startTime, endTime } = shiftData;
    setshowEndDate("");
    const currentDate = new Date(item.startDate);
    let startDate = new Date(item.startDate);
    let endDate = new Date(item.startDate);

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
      setshowEndDate(tommorrow.toString().slice(0, 10));
    }

    setShiftData({
      ...shiftData,
      [name]: value,
      startDate,
      endDate,
    });
  };

  const handleSubmit = async () => {
    const shiftDate = new Date(shiftData.startDate).toISOString().split("T")[0];
    console.log(shiftDate);
    const shiftEndDate = new Date(shiftData.endDate)
      .toISOString()
      .split("T")[0];

    const filteredRosterData = rosterData?.filter((roster) => {
      return (
        (compareDate(roster?.startDate, shiftData.startDate) ||
          compareDate(roster?.endDate, shiftData.startDate) ||
          compareDate(roster?.startDate, shiftData.endDate) ||
          compareDate(roster?.startDate, shiftData.endDate)) &&
        roster?.staffName !== "empty" &&
        roster?.staffName === shiftData.staffName &&
        roster?._id !== item?._id
      );
    });
    // console.log(filteredRosterData);
    let canAddShift = true;
    const newShiftStart = new Date(`${shiftDate}T${shiftData.startTime}`);

    const newShiftEnd = new Date(`${shiftEndDate}T${shiftData.endTime}`);

    filteredRosterData?.forEach((roster) => {
      const existingShiftStart = new Date(
        `${new Date(roster.startDate).toISOString().split("T")[0]}T${
          roster.startTime
        }`
      );
      const existingShiftEnd = new Date(
        `${new Date(roster.endDate).toISOString().split("T")[0]}T${
          roster.endTime
        }`
      );

      if (compareDate(roster.startDate, item.startDate)) {
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

    const response = await updateRoster({ id: item._id, ...shiftData });
    console.log(response);

    toast.success(`Shift updated for ${shiftData.staffName}`);
    getRosterData();
    setShow(false);
  };

  const handleDelete = async () => {
    const response = await deleteRoster(item._id);

    toast.success("shift is deleted");
    getRosterData();
    setShow(false);
  };
  return (
    <>
      <Draggable draggableId={item._id} index={itemIndex}>
        {(provided) => (
          <div
            className="roster mb-1"
            role="button"
            onClick={handleShow}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
            style={{
              ...provided.draggableProps.style,
              background:
                item.staffName !== "empty" ? "rgb(84, 223, 84)" : "white",
            }}
          >
            {" "}
            <p className="p-0 m-0 fw-bold">
              {item.startTime} - {item.endTime}
            </p>
            <p className="p-0 m-0">{item.staffName}</p>
          </div>
        )}
      </Draggable>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Select
              name="staffName"
              value={shiftData.staffName}
              onChange={handleSelectChange}
              required
            >
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
          {staffToSHow?.length > 0 ? null : (
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
          <p className="d-flex align-items-center gap-3">
            <FaDotCircle /> {item.department}
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
          <div className="d-flex gap-2">
            <Button variant="danger" onClick={handleDelete}>
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

export default EditRoster;
