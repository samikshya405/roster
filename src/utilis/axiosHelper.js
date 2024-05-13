import axios from "axios"

const rootAPI = import.meta.env.VITE_ROOT_API;
const staffEP = "http://localhost:8000/api/v1/staffs"
const rosterEP = rootAPI + '/roster'


//get user
export const getStaff =()=>{
    const data = axios.get(staffEP)
    return data

}

//post user
export const postNewStaff=(staffDetails)=>{

}