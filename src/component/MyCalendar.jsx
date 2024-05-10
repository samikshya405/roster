import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import RosterForm from "./RosterForm";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const department = [
  "Receptionist",
  "Nurse",
  "Doctor",
  "Nursing Assistant",
  "Medicator",
  "Cleaner",
];

const shiftData = [
  {
    date: "2024-05-05",
    shiftTime: "09-04",
    staffName: "S kharel",
    department: "Receptionist",
  },
  {
    date: "2024-05-05",
    shiftTime: "09-04",
    staffName: "S kharel",
    department: "Receptionist",
  },
  {
    date: "2024-05-05",
    shiftTime: "09-04",
    staffName: "S kharel",
    department: "Receptionist",
  },
  {
    date: "2024-05-06",
    shiftTime: "09-04",
    staffName: "S kharel",
    department: "Receptionist",
  },
  {
    date: "2024-05-06",
    shiftTime: "09-04",
    staffName: "S kharel",
    department: "Receptionist",
  },
  {
    date: "2024-05-06",
    shiftTime: "09-04",
    staffName: "S kharel",
    department: "Receptionist",
  },
  {
    date: "2024-05-06",
    shiftTime: "09-04",
    staffName: "S kharel",
    department: "Receptionist",
  },
  {
    date: "2024-05-10",
    shiftTime: "09-04",
    staffName: "S kharel",
    department: "Doctor",
  },
  {
    date: "2024-05-15",
    shiftTime: "09-04",
    staffName: "S Sapkota",
    department: "Nursing Assistant",
  },
];

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  

  const handleChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setSelectedDate(selectedDate);
  };

  // Function to generate the entire week's dates and days
  const generateWeek = (selectedDate) => {
    const startDate = new Date(selectedDate);
    startDate.setDate(selectedDate.getDate() - selectedDate.getDay()); // Move to the start of the week

    const week = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const day = dayNames[currentDate.getDay()];
      week.push({ date: currentDate, day: day });
    }
    return week;
  };

  const week = generateWeek(selectedDate);
  console.log(week[0])

  const currentDay = dayNames[new Date().getDay()];

  return (
    <div>
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
        <div className="staff ">
          <input placeholder=" search" />
        </div>
        <div className="table">
          <Table bordered className="table-box">
            <thead>
              <tr>
                {week.map((day, index) => (
                  <th
                    key={index}
                    className={`text-center ${
                      currentDay === day.day ? "text-primary" : "text-dark"
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
            <tbody>
              {department.map((dept, deptIndex) => (
                <tr key={deptIndex} className="tableData">
                  {week.map((day, dayIndex) => (
                    <td key={dayIndex} style={{ width: "calc(100% / 7" }}>
                      <div className="table-data">
                        <p className="fw-bold">{dayIndex === 0 && dept}</p>
                        <div className="text-center mb-1">
                        
                          
                          <RosterForm  day={day}
                            
                          />
                        </div>

                        {shiftData.map((item, itemIndex) => {
                          const itemDate = new Date(item.date);
                          if (
                            itemDate.toISOString().split("T")[0] ===
                              day.date.toISOString().split("T")[0] &&
                            item.department === dept
                          ) {
                            return (
                              <div key={itemIndex} className="roster mb-1">
                                {" "}
                                <p className="p-0 m-0 fw-bold">
                                  {item.shiftTime}
                                </p>
                                <p className="p-0 m-0">{item.staffName}</p>
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;
