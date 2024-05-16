import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { IoMdAddCircle } from "react-icons/io";
import { CustomInput } from "./CustomInput";
import { postNewStaff } from "../utilis/axiosHelper";
import { toast } from 'react-toastify';

const inputs = [
  {
    name: "fName",
    type: "text",
    label: "First Name",
    placeholder: "Your Name",
    required: true,
  },
  {
    name: "lName",
    type: "text",
    label: "Last Name",
    placeholder: "Your last Name",
    required: true,
  },
  {
    name: "phone",
    type: "number",
    label: "Phone",
    placeholder: "69565986",
    required: false,
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Your email",
    required: true,
  },
];

const initialState = {
  fName: "",
  lName: "",
  phone: null,
  email: "",
  department: "",
};

function AddTeamMember({ department,getStaffList }) {
  const [show, setShow] = useState(false);
  const [formData, setformData] = useState(initialState);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };
  const handleSelectChange = (e) => {
    const department = e.target.value;
    setformData({ ...formData, department });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formData);
    const response = await postNewStaff(formData)
    getStaffList()
    console.log(response.data.message);
    setShow(false);
    toast.success("New team member added")
  };

  return (
    <>
      <div
        className="py-4 ps-3"
        role="button"
        style={{ fontSize: "14px" }}
        onClick={handleShow}
      >
        <IoMdAddCircle /> Add Team Member
      </div>
      <hr className="p-0 m-0" />
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Label htmlFor="dept">Select Department</Form.Label>
            <Form.Select id="dept" onChange={handleSelectChange} required>
              <option value="">Select Department</option>
              {department.map((dept, i) => (
                <option key={i} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </Form.Select>

            {inputs.map((input, i) => (
              <CustomInput key={i} {...input} onChange={handleChange} />
            ))}
            <div className="text-center m-3">
              <Button variant="primary" type="submit">
                Add Team Member
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddTeamMember;
