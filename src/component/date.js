
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const compareDate = (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
  return d1.toDateString() === d2.toDateString();
};


export const generateWeek = (selectedDate) => {
    const startDate = new Date(selectedDate);
   

    const dayOfWeek = selectedDate.getDay();
  
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Offset to Monday
    startDate.setDate(selectedDate.getDate() - mondayOffset); // Move to the start of the week

    const week = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const day = dayNames[currentDate.getDay()];
      week.push({ date: currentDate, day: day });
    }
    return week;
  };