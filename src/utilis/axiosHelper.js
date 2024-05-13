import axios from "axios"

const rootAPI = import.meta.env.VITE_ROOT_API;
const staffEP = "http://localhost:8000/api/v1/staffs"
const departmentEP = "http://localhost:8000/api/v1/departments"
const rosterEP = rootAPI + '/roster'


//get user
export const getStaff =()=>{
    const data = axios.get(staffEP)
    return data

}

//post user
export const postNewStaff=(staffDetails)=>{

}

//post department
export const postDepartment=(department)=>{
    const data = axios.post(departmentEP,department)
    return data
}

//get department
export const getdepartment=()=>{
    const data = axios.get(departmentEP)
    return data
}