import React, { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import RosterForm from "./RosterForm";
import AddNewArea from "./AddNewArea";

import { getRoster, getStaff, getdepartment, updateRoster } from "../utilis/axiosHelper";
import AddTeamMember from "./AddTeamMember";
import { compareDate, generateWeek } from "./date";
import EditRoster from "./EditRoster";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import EachRow from "./EachRow";
import Overlapped from "./Overlapped";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [staffList, setStaffList] = useState([]);
  const [department, setdepartment] = useState([]);
  const [shiftData, setshiftData] = useState([]);
  const [isOverLapped, setIsOverLapped] = useState(false)

  const getStaffList = async () => {
    const response = await getStaff();
    const { staffs } = response.data;

    setStaffList(staffs);
  };

  const getDepartmentList = async () => {
    const response = await getdepartment();
    const { departments } = response.data;

    setdepartment(departments);
  };

  const getRosterData = async () => {
    const response = await getRoster();
    const { result } = response.data;

    setshiftData(result);
  };
  useEffect(() => {
    getStaffList();
    getDepartmentList();
    getRosterData();
  }, []);

  const handleChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setSelectedDate(selectedDate);
  };

  const week = generateWeek(selectedDate);

  const currentDay = new Date();
  const onDragEnd = async(result) => {
    
    const { source, destination } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const droppableDate = destination.droppableId.slice(24);
    const depId = destination.droppableId.slice(0, 24);
    const dragId = result.draggableId;
    const objtoUpdate = shiftData.find((item) => item._id === dragId);
  

    const depName = department.find((item) => item._id === depId).name;
    if (depName === objtoUpdate.department) {
      const currentDate = new Date(droppableDate);
      let tomorrow = currentDate;
      if (!compareDate(objtoUpdate.startDate, objtoUpdate.endDate)) {
        tomorrow.setDate(currentDate.getDate() + 1);
      }
      const filteredRosterData = shiftData?.filter((roster) => {
        return (
          (compareDate(roster?.startDate, currentDate) ||
            compareDate(roster?.endDate, currentDate) ||
            compareDate(roster?.startDate, tomorrow) ||
            compareDate(roster?.startDate, tomorrow)) &&
          roster?.staffName !== "empty" &&
          roster?.staffName === objtoUpdate.staffName 
          &&
          roster?._id !== objtoUpdate?._id
        );
      });

      const shiftDate = new Date(currentDate).toISOString().split("T")[0];
      const shiftEndDate = new Date(tomorrow).toISOString().split("T")[0]
      let canAddShift = true;
      const newShiftStart = new Date(`${shiftDate}T${objtoUpdate.startTime}`);

      const newShiftEnd = new Date(`${shiftEndDate}T${objtoUpdate.endTime}`);

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
  
        if (compareDate(roster.startDate, currentDate)) {
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
        setIsOverLapped(true);
        console.log("overlapped detected");
        
        
        return;
      }
      objtoUpdate.startDate = currentDate
      objtoUpdate.endDate = tomorrow
      const response = await updateRoster({ id: objtoUpdate._id, ...objtoUpdate });
    
    getRosterData();
    }
  };

  return (
    <div>
      {
        isOverLapped && <Overlapped/>
      }
      
      <div className="d-flex justify-content-center p-2 m-3">
        <div>
          <input
            type="date"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="main d-flex">
        <div className="staff p-0 m-0 ">
          <Form.Control type="text" placeholder="Search" className=" mr-sm-2" />
          <AddTeamMember department={department} getStaffList={getStaffList} />
          {staffList?.map((staff, i) => (
            <div key={i}>
              <div className="p-2 ps-3 ">
                <p className="p-0 m-0  text-capitalize">{staff.fName}</p>
                <p className="p-0 m-0 text-muted">0.0hr</p>
              </div>
              <hr className="p-0 m-0" />
            </div>
          ))}
        </div>
        <div className="table">
          <Table bordered className="table-box">
            <thead>
              <tr>
                {week.map((day, index) => (
                  <th
                    key={index}
                    className={`text-center ${
                      compareDate(currentDay, day.date)
                        ? "text-primary"
                        : "text-dark"
                    }`}
                  >
                    {day.day}
                    <br />
                    <span className="text-muted" style={{ fontSize: "10px" }}>
                      {day.date.toISOString().split("T")[0]}{" "}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <DragDropContext onDragEnd={onDragEnd}>
              <tbody>
                {department.map((dept, deptIndex) => (
                  <tr key={deptIndex} className="tableData">
                    {week.map((day, dayIndex) => (
                      <EachRow
                        key={dayIndex}
                        dept={dept}
                        day={day}
                        dayIndex={dayIndex}
                        staffList={staffList}
                        getRosterData={getRosterData}
                        shiftData={shiftData}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </DragDropContext>
          </Table>
          <AddNewArea getDepartmentList={getDepartmentList} />
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;
