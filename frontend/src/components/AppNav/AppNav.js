import React from "react";
import { Row, Col, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const AppNav = () => {
  return (
    <>
      <Row className="no-gutters">
        <Col>
          <Navbar bg="light" expand="lg" variant="light">
            <LinkContainer to="/">
              <Navbar.Brand>Project Manager</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto pull-right">
                <LinkContainer to="/add-project">
                  <Nav.Link>Add project</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/add-task">
                  <Nav.Link>Add task</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/add-user">
                  <Nav.Link>Add User</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/view-task">
                  <Nav.Link>View Task</Nav.Link>
                </LinkContainer>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Col>
      </Row>
    </>
  );
};

export default AppNav;
