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
import * as _ from "lodash";

export const AddUser = () => {
  const usersList = [
    {
      firstName: "Sid",
      lastName: "Patel",
      empId: "393470"
    },
    {
      firstName: "Palak",
      lastName: "Pastagiya",
      empId: "393471"
    },
    {
      firstName: "Zeeva",
      lastName: "Sharma",
      empId: "393472"
    }
  ];
  const handleChange = e => {
    let newList = [];
    if (e.target.value !== "") {
      newList = usersList.filter(item => {
        const fData = item.firstName.toLowerCase();
        const lData = item.lastName.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return (
          fData.includes(filter) ||
          lData.includes(filter) ||
          item.empId.includes(filter)
        );
      });
    } else {
      newList = usersList;
    }
    setUsers(newList);
  };
  const handleSort = field => {
    const sortFirstName = _.sortBy(usersList, field);
    setUsers(sortFirstName);
    // setActiveSort(true);
  };
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
  // const [activeSort, setActiveSort] = useState(false);
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
          <Col xs={12} sm={6}>
            <FormControl
              placeholder="Search"
              onChange={handleChange}
              className="mb-4"
            />
          </Col>
          <Col xs={12} sm={6}>
            Sort By:
            {/* {users.keys.map(key => {
              <Button
                variant="outline-primary"
                className="ml-2"
                onClick={() => handleSort(key)}
              >
                {key}
              </Button>;
            })} */}
            <Button
              variant="outline-primary"
              className="ml-2"
              onClick={() => handleSort("firstName")}
            >
              First Name
            </Button>
            <Button
              variant="outline-primary"
              className="ml-2"
              onClick={() => handleSort("lastName")}
            >
              Last Name
            </Button>
            <Button
              variant="outline-primary"
              className="ml-2"
              onClick={() => handleSort("empID")}
            >
              ID
            </Button>
          </Col>
        </Row>
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
