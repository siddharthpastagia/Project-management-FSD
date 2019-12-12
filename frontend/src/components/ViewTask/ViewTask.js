import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  FormLabel,
  InputGroup,
  FormControl,
  Button,
  ListGroup,
  ListGroupItem
} from "react-bootstrap";
import * as moment from "moment";
import { getAllTasks, updateTaskAsComplete } from "../../api/Api";

export const ViewTask = () => {
  let [tasks, setTasks] = useState([]);
  let [statusMessage, setStatusMessage] = useState({
    show: false,
    message: "",
    variant: ""
  });
  async function fetchAllTasks() {
    try {
      setTasks(await getAllTasks());
    } catch (err) {
      setStatusMessage({
        ...statusMessage,
        show: true,
        message: err,
        variant: "danger"
      });
    }
  }

  function formatDate(date) {
    return moment(date).format("YYYY-MM-DD");
  }

  useEffect(() => {
    fetchAllTasks();
  }, []);
  return (
    <>
      <Container>
        <Row>
          <Col className="mt-3">
            <InputGroup>
              <FormControl required readOnly name="project"></FormControl>
              <InputGroup.Append>
                <Button variant="outline-primary" onClick={() => {}}>
                  Search project
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <table className="table table-bordered mt-5">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Parent</th>
                  <th>Priority</th>
                  <th>Start</th>
                  <th>End</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => {
                  return (
                    <tr>
                      <td>{task.taskName}</td>
                      <td></td>
                      <td>{task.priority}</td>
                      <td>{formatDate(task.startDate)}</td>
                      <td>{formatDate(task.endDate)}</td>
                      <td>
                        <Button variant="outline-primary">Edit</Button>
                        <Button
                          variant="outline-primary"
                          className="ml-2"
                          onClick={updateTaskAsComplete(task)}
                        >
                          End Task
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </>
  );
};
