import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  FormLabel,
  InputGroup,
  FormControl,
  Button,
  Alert
} from "react-bootstrap";
import moment from "moment";
import * as _ from "lodash";
import SearchModal from "../common/SearchModal";
import {
  getAllTasksByProjectId,
  updateTaskAsComplete,
  getAllProjects,
  getTaskById
} from "../../api/Api";

const ViewTask = () => {
  let [tasks, setTasks] = useState([]);
  let [statusMessage, setStatusMessage] = useState({
    show: false,
    message: "",
    variant: ""
  });

  //////////////////////////////////////////
  //Serach Project
  let history = useHistory();
  let [project, setProject] = useState("");
  let [projectList, setProjectList] = useState([]);
  let [showProjectModal, setShowProjectModal] = useState(false);
  let [sortMode, setSortMode] = useState(false);
  let [startDateSort, setStartDateSort] = useState(false);
  let [endDateSort, setEndDateSort] = useState(false);
  let [prioritySort, setPrioritySort] = useState(false);
  let [taskCompleted, setTaskCompleted] = useState(false);
  const searchProject = async () => {
    setProjectList(await getAllProjects());
    setShowProjectModal(true);
  };
  function onCloseProjectModal(val) {
    setShowProjectModal(false);
  }
  function onSearchProject(project) {
    setProject(project);
  }

  async function fetchTasksByProjectId() {
    if (project) {
      try {
        setTasks(await getAllTasksByProjectId(project));
      } catch (err) {
        setStatusMessage({
          ...statusMessage,
          show: true,
          message: err,
          variant: "danger"
        });
      }
      setSortMode(false);
    }
  }

  function formatDate(date) {
    return moment(date).format("YYYY-MM-DD");
  }

  // edit project

  const editTask = async task => {
    const currentTask = await getTaskById(task._id);
    history.push("add-task", currentTask);
  };
  // sorting

  const handleSort = field => {
    setSortMode(true);
    const sortByField = _.sortBy(tasks, field);
    setTasks(sortByField);
  };
  useEffect(() => {
    fetchTasksByProjectId();
  }, [project]);
  return (
    <>
      <Container>
        <Row>
          <Col>
            <h3 className="mt-3">View Tasks</h3>
          </Col>
        </Row>
        {taskCompleted && (
          <Alert variant="info" className="mt-3">
            Selected task has been Completed.
          </Alert>
        )}
        <Row>
          <Col className="mt-3">
            <FormLabel>Search Project</FormLabel>
            <InputGroup>
              <FormControl
                required
                readOnly
                name="project"
                value={project.projectName}
              ></FormControl>
              <InputGroup.Append>
                <Button
                  variant="outline-primary"
                  onClick={searchProject}
                  data-testid="searchIcon"
                >
                  <i className="fa fa-search"></i>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
          <SearchModal
            id="searchProject"
            heading="Search Project"
            showModal={showProjectModal}
            onCloseModal={onCloseProjectModal}
            data={projectList}
            columns={[
              { dataField: "_id", hidden: true },
              { dataField: "projectName", text: "Project List" }
            ]}
            onSearch={onSearchProject}
          />
        </Row>
        <Row className="mt-3 mb-3">
          <Col xs={12} sm={6}>
            Sort Task By:
            <Button
              data-testid="sortStartDate"
              variant="outline-primary"
              className={sortMode && startDateSort ? "active ml-2" : "ml-2"}
              onClick={() => {
                handleSort("startDate");
                setStartDateSort(true);
                setEndDateSort(false);
                setPrioritySort(false);
              }}
            >
              Start Date
            </Button>
            <Button
              data-testid="sortEndDate"
              variant="outline-primary"
              className={sortMode && endDateSort ? "active ml-2" : "ml-2"}
              onClick={() => {
                handleSort("endDate");
                setStartDateSort(false);
                setEndDateSort(true);
                setPrioritySort(false);
              }}
            >
              End Date
            </Button>
            <Button
              data-testid="sortPriority"
              variant="outline-primary"
              className={sortMode && prioritySort ? "active ml-2" : "ml-2"}
              onClick={() => {
                handleSort("priority");
                setStartDateSort(false);
                setEndDateSort(false);
                setPrioritySort(true);
              }}
            >
              Priority
            </Button>
          </Col>
        </Row>
        <Alert variant="info" className="mt-3">
          Please click on Search icon to view tasks related to that project.
        </Alert>
        {tasks.length > 0 ? (
          <Row>
            <Col>
              <table className="table table-bordered mt-5">
                <thead>
                  <tr className="table-primary">
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
                      <tr className="table-light">
                        <td>{task.taskName}</td>
                        <td>{task.parentTask && task.parentTask.taskName}</td>
                        <td>{task.priority}</td>
                        <td>{formatDate(task.startDate)}</td>
                        <td>{formatDate(task.endDate)}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            onClick={() => editTask(task)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-primary"
                            className="ml-2"
                            disabled={task.status === "Completed"}
                            onClick={async e => {
                              e.target.disabled = true;
                              await updateTaskAsComplete(task);
                              setTaskCompleted(true);
                            }}
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
        ) : (
          <Alert variant="warning">
            No task available for selected project, please select another
            project from the list
          </Alert>
        )}
      </Container>
    </>
  );
};

export default withRouter(ViewTask);
