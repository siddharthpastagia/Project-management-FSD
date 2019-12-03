import React from "react";
import { Jumbotron, Row, Col } from "react-bootstrap";
import "./Dashboard.scss";

export const Dashboard = () => {
  return (
    <div className="container-fluid">
      <div className="wrapper">
        <Row>
          <Col>
            <Jumbotron>
              <h1>Welcome to Project Manager App</h1>
            </Jumbotron>
          </Col>
        </Row>
      </div>
    </div>
  );
};
