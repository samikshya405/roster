import React from "react";
import { Form } from "react-bootstrap";

export const CustomInput = ({label,...rest}) => {
  return (
    <>
      {" "}
      <Form.Label>{label}</Form.Label>
      <Form.Control
        {...rest}
      />
    </>
  );
};


