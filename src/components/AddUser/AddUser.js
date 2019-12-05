import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  FormControl,
  Button,
  ListGroup
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./AddUser.scss";

export const AddUser = () => {
  const usersList = [
    {
      firstName: "Sid",
      lastName: "pastagiya",
      empId: 393470
    },
    {
      firstName: "Palak",
      lastName: "pastagiya",
      empId: 393471
    },
    {
      firstName: "Zeeva",
      lastName: "pastagiya",
      empId: 393472
    }
  ];
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      empId: ""
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please enter First Name"),
      lastName: Yup.string().required("Please enter Last Name"),
      empId: Yup.string().required("Please enter Employee ID")
    })
  });
  const [users, setUsers] = useState(usersList);
  return (
    <>
      <Container>
        <Row>
          <Col className="mt-5">
            <form onSubmit={formik.handleSubmit}>
              <FormControl
                required
                placeholder="FirstName"
                name="firstName"
                errors={formik.errors.firstName}
                className={
                  formik.touched.firstName
                    ? formik.errors.firstName
                      ? "is-invalid mb-2 mt-2"
                      : "is-valid mb-2 mt-2"
                    : "mb-2 mt-2"
                }
                {...formik.getFieldProps("firstName")}
              ></FormControl>
              <FormControl.Feedback type="invalid">
                {formik.errors.firstName}
              </FormControl.Feedback>
              <FormControl
                placeholder="LastName"
                name="lastName"
                required
                errors={formik.errors.lastName}
                {...formik.getFieldProps("lastName")}
                className={
                  formik.touched.lastName
                    ? formik.errors.lastName
                      ? "is-invalid mb-2 mt-2"
                      : "is-valid mb-2 mt-2"
                    : "mb-2 mt-2"
                }
              ></FormControl>
              <FormControl.Feedback type="invalid">
                {formik.errors.lastName}
              </FormControl.Feedback>
              <FormControl
                placeholder="Employee ID"
                name="empId"
                required
                errors={formik.errors.empId}
                {...formik.getFieldProps("empId")}
                className={
                  formik.touched.empId
                    ? formik.errors.empId
                      ? "is-invalid mb-2 mt-2"
                      : "is-valid mb-2 mt-2"
                    : "mb-2 mt-2"
                }
              ></FormControl>
              <FormControl.Feedback type="invalid">
                {formik.errors.empId}
              </FormControl.Feedback>
              <div className="float-right">
                <Button
                  variant="primary"
                  disabled={!formik.isValid || !formik.dirty}
                  type="submit"
                  className="ml-2 mr-2"
                >
                  Add
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    formik.resetForm();
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <ListGroup>
              {users.map(user => {
                return (
                  <ListGroup.Item className="user-list" key={user.empId}>
                    <div>
                      <p>FirstName : {user.firstName}</p>
                      <p>LastName : {user.lastName}</p>
                      <p>Employee ID : {user.empId}</p>
                    </div>
                    <div>
                      <Button variant="outline-primary">Edit</Button>
                      <br />
                      <Button
                        variant="outline-secondary"
                        className="mt-2"
                        onClick={() => {
                          const filterList = usersList.filter(
                            m => m.empId !== user.empId
                          );
                          setUsers(filterList);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </>
  );
};
