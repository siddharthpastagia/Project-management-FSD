import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  FormControl,
  InputGroup,
  Button,
  ListGroup,
  Alert,
  Form,
  FormLabel
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./AddProject.scss";
import * as _ from "lodash";

import SearchModal from "../common/SearchModal";

import {
  getAllProject,
  addNewProject,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  getAllUsers
} from "../../api/Api";
import moment from "moment";

export const AddProject = () => {
  const initialStartDate = formatDate(new Date());
  const initialEndDate = formatDate(getAfterDate(1));
  let [projectList, setProjectList] = useState([]);
  let [projectUpdated, setProjectUpdated] = useState(false);
  let [projects, setProjects] = useState([]);
  let [sortMode, setSortMode] = useState(false);
  let [editMode, setEditMode] = useState(false);
  let [projectId, setProjectId] = useState("");
  let [projectName, setProjectName] = useState("");

  let [startDate, setStartDate] = useState(initialStartDate);
  let [endDate, setEndDate] = useState(initialEndDate);
  let [dateRequired, setDateRequired] = useState(false);

  let [priority, setPriority] = useState("");
  let [statusMessage, setStatusMessage] = useState({
    show: false,
    message: "",
    variant: ""
  });
  let [startDateSort, setStartDateSort] = useState(false);
  let [endDateSort, setEndDateSort] = useState(false);
  let [prioritySort, setPrioritySort] = useState(false);

  const fetchAllProjects = async () => {
    try {
      setProjects(await getAllProject());
      setProjectList(await getAllProject());
      setProjectUpdated(false);
    } catch (err) {
      setStatusMessage({
        ...statusMessage,
        show: true,
        message: err,
        variant: "danger"
      });
    }
  };

  const handleSort = field => {
    setSortMode(true);
    const sortByField = _.sortBy(projects, field);
    setProjects(sortByField);
  };
  const deleteProject = async project => {
    try {
      const resp = await deleteProjectById(project);
      setProjectUpdated(true);
      setStatusMessage({
        ...statusMessage,
        show: true,
        message: resp.message,
        variant: "success"
      });
    } catch (err) {
      setStatusMessage({
        ...statusMessage,
        show: true,
        message: err,
        variant: "danger"
      });
    }
    resetFormState();
    formik.resetForm();
  };

  const getNumOfCompletedTask = task => {
    const length = task.filter(item => item.status === "Completed").length;
    return length;
  };

  const editProject = async project => {
    try {
      const resp = await getProjectById(project._id);
      setEditMode(true);
      setProjectId(resp._id);
      setProjectName(resp.projectName);
      setDateRequired(resp.dateRequired);
      setStartDate(
        resp.startDate ? formatDate(resp.startDate) : initialStartDate
      );
      setEndDate(resp.endDate ? formatDate(resp.endDate) : initialEndDate);
      setPriority(resp.priority);
      setManager(resp.manager);
    } catch (err) {}
  };

  //Call this function after setStatusMessag to autoHide alert message

  const resetFormState = () => {
    setProjectName("");
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setPriority("");
    setManager("");
    setDateRequired(false);
    setEditMode(false);
  };

  function getAfterDate(num) {
    return moment().add(num, "day");
  }

  function formatDate(date) {
    return moment(date).format("YYYY-MM-DD");
  }

  let [showManagerModal, setShowManagerModal] = useState(false);
  let [managerList, setManagerList] = useState([]);
  let [manager, setManager] = useState("");

  const onCloseManagerModal = val => {
    setShowManagerModal(false);
  };
  const searchManager = async () => {
    setManagerList(await getAllUsers());
    setShowManagerModal(true);
  };
  const onSearchManager = (data, setFieldValue) => {
    setFieldValue("manager", data);
  };

  useEffect(() => {
    fetchAllProjects();
  }, [projectUpdated]);

  const handleChange = e => {
    let newList = [];
    if (e.target.value !== "") {
      newList = projectList.filter(item => {
        const pData = item.projectName.toLowerCase();
        const priorityData =
          item.priority !== null ? item.priority.toString().toLowerCase() : "";
        const startDateData = formatDate(item.startDate).toLowerCase();
        const endDateData = formatDate(item.endDate).toLowerCase();
        const filter = e.target.value.toLowerCase();
        return (
          pData.includes(filter) ||
          priorityData.includes(filter) ||
          startDateData.includes(filter) ||
          endDateData.includes(filter)
        );
      });
    } else {
      newList = projectList;
    }
    setProjects(newList);
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      projectId: projectId,
      projectName: projectName,
      startDate: startDate,
      endDate: endDate,
      priority: priority,
      dateRequired: dateRequired,
      manager: manager
    },
    validationSchema: Yup.object({
      projectName: Yup.string().required("Please enter Project Name"),
      startDate: Yup.date().when("dateRequired", {
        is: true,
        then: Yup.date().required("Please enter start date"),
        otherwise: Yup.date()
      }),
      endDate: Yup.date().when("dateRequired", {
        is: true,
        then: Yup.date()
          .required("Please enter end date")
          .test(
            "compare",
            "End date should be greater than Start date",
            function(endDate) {
              return endDate > this.parent.startDate;
            }
          ),
        otherwise: Yup.date()
      }),
      priority: Yup.number().required("Please enter Priority"),
      dateRequired: Yup.boolean(),
      manager: Yup.object().required("Please select Manager from serach")
    }),
    onSubmit: async value => {
      if (!value.dateRequired) {
        delete value.startDate;
        delete value.endDate;
      }
      try {
        const resp = !editMode
          ? await addNewProject(value)
          : await updateProjectById(value);
        setProjectUpdated(true);
        setStatusMessage({
          ...statusMessage,
          show: true,
          message: resp.message,
          variant: "success"
        });
      } catch (err) {
        setStatusMessage({
          ...statusMessage,
          show: true,
          message: err,
          variant: "danger"
        });
      }
      resetFormState();
      formik.resetForm();
    }
  });

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h3 className="mt-3">Project Management</h3>
          </Col>
        </Row>
        <Row>
          <Col className="mt-3">
            <Alert
              variant={statusMessage.variant}
              show={statusMessage.show}
              onClose={() => {
                setStatusMessage({ ...statusMessage, show: false });
              }}
              dismissible
            >
              {statusMessage.message}
            </Alert>
            <form onSubmit={formik.handleSubmit}>
              <Form.Group>
                <Form.Label>Project Name</Form.Label>

                <FormControl
                  required
                  placeholder="Project Name"
                  name="projectName"
                  errors={formik.errors.projectName}
                  className={
                    formik.touched.projectName
                      ? formik.errors.projectName
                        ? "is-invalid mb-2 mt-2"
                        : "is-valid mb-2 mt-2"
                      : "mb-2 mt-2"
                  }
                  {...formik.getFieldProps("projectName")}
                ></FormControl>
                <FormControl.Feedback type="invalid">
                  {formik.errors.projectName}
                </FormControl.Feedback>
              </Form.Group>

              <Form.Check
                type="checkbox"
                name="dateRequired"
                value={formik.values.dateRequired}
                checked={formik.values.dateRequired}
                label="Set Start and End date"
                {...formik.getFieldProps("dateRequired")}
              />
              <Form.Label className="mt-2">Start Date</Form.Label>
              <FormControl
                placeholder="Start Date"
                name="startDate"
                type="date"
                disabled={!formik.values.dateRequired}
                required={false}
                errors={formik.errors.startDate}
                className={
                  formik.touched.startDate
                    ? formik.errors.startDate
                      ? "is-invalid mb-2 mt-2"
                      : "is-valid mb-2 mt-2"
                    : "mb-2 mt-2"
                }
                {...formik.getFieldProps("startDate")}
              ></FormControl>
              <FormControl.Feedback type="invalid">
                {formik.errors.startDate}
              </FormControl.Feedback>
              <Form.Label>End Date</Form.Label>
              <FormControl
                placeholder="End Date"
                name="endDate"
                type="date"
                disabled={!formik.values.dateRequired}
                required={false}
                errors={formik.errors.endDate}
                className={
                  formik.touched.endDate
                    ? formik.errors.endDate
                      ? "is-invalid mb-2 mt-2"
                      : "is-valid mb-2 mt-2"
                    : "mb-2 mt-2"
                }
                {...formik.getFieldProps("endDate")}
              ></FormControl>
              <FormControl.Feedback type="invalid">
                {formik.errors.endDate}
              </FormControl.Feedback>
              <Form.Label>Priority</Form.Label>
              <FormControl
                placeholder="priority"
                name="priority"
                type="range"
                min="0"
                max="30"
                step="1"
                data-testid="priorityField"
                errors={formik.errors.priority}
                className={
                  formik.touched.priority
                    ? formik.errors.priority
                      ? "is-invalid mb-2 mt-2"
                      : "is-valid mb-2 mt-2"
                    : "mb-2 mt-2"
                }
                {...formik.getFieldProps("priority")}
              ></FormControl>

              <FormControl.Feedback type="invalid">
                {formik.errors.priority}
              </FormControl.Feedback>
              <Form.Label>Serach Manager</Form.Label>
              <InputGroup>
                {formik.values.manager.firstName ? (
                  <FormLabel className="modal-label">{`${formik.values.manager.firstName} ${formik.values.manager.lastName}`}</FormLabel>
                ) : (
                  <FormLabel className="modal-label"></FormLabel>
                )}
                <FormControl
                  plaintext
                  required
                  readOnly
                  hidden
                  name="manager"
                  errors={formik.errors.manager}
                  className={
                    formik.touched.manager
                      ? formik.errors.manager
                        ? "is-invalid mb-2 mt-2"
                        : "is-valid mb-2 mt-2"
                      : "mb-2 mt-2"
                  }
                  {...formik.getFieldProps("manager")}
                ></FormControl>
                <InputGroup.Append>
                  <Button onClick={searchManager}>
                    <i className="fa fa-search"></i>
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <FormControl.Feedback type="invalid">
                {formik.errors.manager}
              </FormControl.Feedback>

              <div className="text-center mt-4 mb-4">
                <Button
                  data-testid="updateProject"
                  variant="primary"
                  disabled={!formik.isValid || !formik.dirty}
                  type="submit"
                  className="ml-2 mr-2"
                >
                  {editMode ? "Update" : "Add"}
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    resetFormState();
                    formik.resetForm();
                  }}
                >
                  Reset
                </Button>
              </div>
              <SearchModal
                id="searchManager"
                heading="Serach Manager"
                showModal={showManagerModal}
                onCloseModal={onCloseManagerModal}
                data={managerList}
                columns={[
                  { dataField: "_id", hidden: true },
                  { dataField: "firstName", text: "User List" },
                  { dataField: "lastName", hidden: true }
                ]}
                onSearch={data => {
                  onSearchManager(data, formik.setFieldValue);
                }}
              />
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
              name="search"
            />
          </Col>
          <Col xs={12} sm={6}>
            Sort By:
            <Button
              variant="outline-primary"
              className={sortMode && startDateSort ? "active ml-2" : "ml-2"}
              data-testid="sortStartDate"
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
              variant="outline-primary"
              className={sortMode && endDateSort ? "active ml-2" : "ml-2"}
              data-testid="sortEndDate"
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
              variant="outline-primary"
              className={sortMode && prioritySort ? "active ml-2" : "ml-2"}
              data-testid="sortPriority"
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
        <Row>
          <Col>
            {projects.length === 0 && (
              <Alert variant="warning">
                Projects are not available in database!!
              </Alert>
            )}
            <ListGroup>
              {projects.map(project => {
                return (
                  <ListGroup.Item className="project-list" key={project._id}>
                    <div>
                      <p>Project : {project.projectName}</p>
                      <div>
                        <span className="mr-2">
                          Start Date :{" "}
                          {project.startDate && formatDate(project.startDate)}
                        </span>
                        <span className="ml-5">
                          End Date :{" "}
                          {project.endDate && formatDate(project.endDate)}
                        </span>
                      </div>
                      <div>
                        <span className="mr-2">
                          No of tasks: {project.task.length}
                        </span>
                      </div>
                      <div>
                        <span className="mr-2">
                          Completed: {getNumOfCompletedTask(project.task)}
                        </span>
                      </div>
                    </div>
                    <ListGroup>
                      <ListGroup.Item>
                        <p>Priority : </p> <p>{project.priority}</p>
                      </ListGroup.Item>
                    </ListGroup>
                    <div>
                      <Button
                        variant="outline-primary"
                        onClick={() => editProject(project)}
                      >
                        Update
                      </Button>
                      <br />
                      <Button
                        variant="outline-secondary"
                        className="mt-2"
                        onClick={() => {
                          deleteProject(project);
                        }}
                      >
                        Suspend
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
