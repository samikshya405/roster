import React from "react";
import RosterForm from "./RosterForm";
import { compareDate } from "./date";
import EditRoster from "./EditRoster";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const EachRow = ({
  dept,
  day,
  dayIndex,
  staffList,
  getRosterData,
  shiftData,
}) => {
    
  return (
    <Droppable droppableId={dept._id+day.date}>
      {(provided) => (
        <td
          style={{ width: "calc(100% / 7" }}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className="table-data">
            <p className="fw-bold">{dayIndex === 0 && dept.name} </p>
            <div className="text-center mb-1">
              <RosterForm
                day={day}
                deptName={dept.name}
                staffs={staffList}
                getRosterData={getRosterData}
                rosterData={shiftData}
              />
            </div>

            {shiftData?.map((item, itemIndex) => {
              if (
                compareDate(item.startDate, day.date) &&
                item.department === dept.name
              ) {
                return (
                  <div key={itemIndex}>
                    <div>
                      <EditRoster
                        item={item}
                        itemIndex={itemIndex}
                        staffs={staffList}
                        rosterData={shiftData}
                        getRosterData={getRosterData}
                      />
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
          {provided.placeholder}
        </td>
      )}
    </Droppable>
  );
};

export default EachRow;
