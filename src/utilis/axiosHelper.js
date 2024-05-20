import axios from "axios"

const rootAPI = import.meta.env.VITE_ROOT_API;
const staffEP = "http://localhost:8000/api/v1/staffs"
const departmentEP = "http://localhost:8000/api/v1/departments"
const rosterEP = "http://localhost:8000/api/v1/rosters"


//get user
export const getStaff =()=>{
    const data = axios.get(staffEP)
    return data

}

//post user
export const postNewStaff=async(staffDetails)=>{
    const data = await axios.post(staffEP,staffDetails)
    return data

}

//post department
export const postDepartment=async(department)=>{
    const data = await axios.post(departmentEP,department)
    return data
}

//get department
export const getdepartment=()=>{
    const data = axios.get(departmentEP)
    return data
}

//post roster
export const postRoster = async(rosterDetails)=>{
    const data = await axios.post(rosterEP,rosterDetails)
    return data
}

//get roster
export const getRoster = async()=>{
    const data = await axios.get(rosterEP)
    return data
}

export const getRosterBydeptAndDate=async(department,date)=>{
    const response = await axios.get(`${rosterEP}/rosterByDate`, {
        params: {
          department: department,
          date: date
        }
      });
      return response.data;
}