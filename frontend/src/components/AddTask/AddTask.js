import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  FormControl,
  Button,
  Alert,
  Form,
  FormLabel,
  InputGroup
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import SearchModal from "../common/SearchModal";
import {
  addNewTask,
  getAllUsers,
  getAllProjects,
  getAllParentTasks,
  addParentTask,
  updateParentTaskById,
  updateTaskById
} from "../../api/Api";
import moment from "moment";
import "./AddTask.scss";

export const AddTask = props => {
  let [taskName, setTaskName] = useState("");
  let [isParentTask, setIsParentTask] = useState(false);
  let [user, setUser] = useState("");
  let [userList, setUserList] = useState([]);
  let [showUserModal, setShowUserModal] = useState(false);
  let [project, setProject] = useState("");
  let [projectList, setProjectList] = useState([]);
  let [showProjectModal, setShowProjectModal] = useState(false);
  let [parentTask, setParentTask] = useState({});
  let [parentTaskList, setParentTaskList] = useState([]);
  let [showParentModal, setShowParentModal] = useState(false);
  const editTaskObj = props.history.location.state;
  const initialStartDate = formatDate(new Date());
  const initialEndDate = formatDate(getAfterDate(1));
  let [startDate, setStartDate] = useState(initialStartDate);
  let [endDate, setEndDate] = useState(initialEndDate);
  let [priority, setPriority] = useState("");
  let [statusMessage, setStatusMessage] = useState({
    show: false,
    message: "",
    variant: ""
  });

  function resetFormState() {
    setProject("");
    setParentTask("");
    setUser("");
    setTaskName("");
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setPriority("");
    setIsParentTask(false);
  }

  function getAfterDate(num) {
    return moment().add(num, "day");
  }

  function formatDate(date) {
    return moment(date).format("YYYY-MM-DD");
  }
  ///////////////////////////////////////////
  //Search User
  const searchUser = async () => {
    setUserList(await getAllUsers());
    setShowUserModal(true);
  };
  function onCloseUserModal(val) {
    setShowUserModal(false);
  }
  function onSearchUser(data, setFieldValue) {
    setFieldValue("user", data);
  }
  //////////////////////////////////////////
  //Serach Project
  const searchProject = async () => {
    setProjectList(await getAllProjects());
    setShowProjectModal(true);
  };
  function onCloseProjectModal(val) {
    setShowProjectModal(false);
  }
  function onSearchProject(data, setFieldValue) {
    setFieldValue("project", data);
  }
  ////////////////////////////////////////////
  //Search Parent Task
  const searchParentTask = async () => {
    setParentTaskList(await getAllParentTasks());
    setShowParentModal(true);
  };
  function onCloseParentModal(val) {
    setShowParentModal(false);
  }
  function onSearchParent(data, setFieldValue) {
    setFieldValue("parentTask", data);
  }
  //////////////////////////////////////////////////
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      project:
        editTaskObj && props.history.action === "PUSH"
          ? editTaskObj.project
          : project,
      parentTask:
        editTaskObj && props.history.action === "PUSH"
          ? editTaskObj.parentTask
          : parentTask,
      user:
        editTaskObj && props.history.action === "PUSH"
          ? editTaskObj.user
          : user,
      taskName:
        editTaskObj && props.history.action === "PUSH"
          ? editTaskObj.taskName
          : taskName,
      startDate:
        editTaskObj && props.history.action === "PUSH"
          ? formatDate(editTaskObj.startDate)
          : startDate,
      endDate:
        editTaskObj && props.history.action === "PUSH"
          ? formatDate(editTaskObj.endDate)
          : endDate,
      priority:
        editTaskObj && props.history.action === "PUSH"
          ? editTaskObj.priority
          : priority,
      isParentTask:
        editTaskObj && props.history.action === "PUSH"
          ? editTaskObj.isParentTask
          : isParentTask
    },
    validationSchema: Yup.object({
      project: Yup.object().required("Please select Project"),
      taskName: Yup.string().required("Please enter Task Name"),
      startDate: Yup.date().when("isParentTask", {
        is: false,
        then: Yup.date().required("Please enter start date"),
        otherwise: Yup.date()
      }),
      endDate: Yup.date().when("isParentTask", {
        is: false,
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
      priority: Yup.number().when("isParentTask", {
        is: false,
        then: Yup.number().required(
          "Please select proper range between 0 to 30 for Priority"
        ),
        otherwise: Yup.number()
      }),
      isParentTask: Yup.boolean(),
      user: Yup.string().when("isParentTask", {
        is: false,
        then: Yup.string().required("Please select User from serach"),
        otherwise: Yup.string()
      }),
      parentTask: Yup.object().when("isParentTask", {
        is: false,
        then: Yup.object(),
        otherwise: Yup.object()
      })
    }),
    onSubmit: async value => {
      if (value.isParentTask) {
        delete value.startDate;
        delete value.endDate;
        delete value.priority;
        delete value.user;
        delete value.parentTask;
        try {
          const resp =
            editTaskObj && props.history.action === "PUSH"
              ? await updateParentTaskById({
                  ...value,
                  parentTaskId: editTaskObj.parentTaskObj._id
                })
              : await addParentTask(value);
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
      }

      try {
        const resp =
          editTaskObj && props.history.action === "PUSH"
            ? await updateTaskById({ ...value, _id: editTaskObj._id })
            : await addNewTask(value);
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
            <h3 className="mt-3">Task Management</h3>
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
              <FormLabel>Search Project</FormLabel>
              <InputGroup>
                {formik.values.project.projectName ? (
                  <FormLabel className="modal-label">{`${formik.values.project.projectName}`}</FormLabel>
                ) : editTaskObj && props.history.action === "PUSH" ? (
                  <FormLabel className="modal-label"></FormLabel>
                ) : (
                  <FormLabel className="modal-label"></FormLabel>
                )}
                <FormControl
                  required
                  readOnly
                  type="hidden"
                  name="project"
                  errors={formik.errors.project}
                  className={
                    formik.touched.project
                      ? formik.errors.project
                        ? "is-invalid mb-2 mt-2"
                        : "is-valid mb-2 mt-2"
                      : "mb-2 mt-2"
                  }
                  {...formik.getFieldProps("project")}
                ></FormControl>

                <InputGroup.Append>
                  <Button
                    variant="outline-primary"
                    data-testid="searchProjectBtn"
                    onClick={searchProject}
                    disabled={editTaskObj && props.history.action === "PUSH"}
                  >
                    <i className="fa fa-search"></i>
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <FormControl.Feedback type="invalid">
                {formik.errors.project}
              </FormControl.Feedback>
              <FormLabel className="mt-2">Task Name</FormLabel>
              <FormControl
                required
                placeholder="Task name"
                name="taskName"
                errors={formik.errors.taskName}
                className={
                  formik.touched.taskName
                    ? formik.errors.taskName
                      ? "is-invalid mb-2 mt-2"
                      : "is-valid mb-2 mt-2"
                    : "mb-2 mt-2"
                }
                {...formik.getFieldProps("taskName")}
              ></FormControl>
              <FormControl.Feedback type="invalid">
                {formik.errors.taskName}
              </FormControl.Feedback>
              <b>
                <Form.Check
                  type="checkbox"
                  data-testid="parentCheckBox"
                  name="isParentTask"
                  value={formik.values.isParentTask}
                  checked={formik.values.isParentTask}
                  label="Parent Task"
                  {...formik.getFieldProps("isParentTask")}
                />
              </b>
              <FormLabel className="mt-2">Priority</FormLabel>
              <FormControl.Feedback type="touched">
                {formik.errors.isParentTask}
              </FormControl.Feedback>

              <FormControl
                placeholder="priority"
                name="priority"
                type="range"
                min="0"
                max="30"
                step="1"
                disabled={formik.values.isParentTask}
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
              <FormLabel className="mt-2">Search Parent Task</FormLabel>
              <InputGroup>
                {formik.values.parentTask &&
                formik.values.parentTask.taskName ? (
                  <FormLabel className="modal-label">{`${formik.values.parentTask.taskName}`}</FormLabel>
                ) : (
                  <FormLabel className="modal-label"></FormLabel>
                )}
                <FormControl
                  required={false}
                  readOnly
                  hidden
                  name="parentTask"
                  disabled={formik.values.isParentTask}
                  errors={formik.errors.parentTask}
                  className={
                    formik.touched.parentTask
                      ? formik.errors.parentTask
                        ? "is-invalid mb-2 mt-2"
                        : "is-valid mb-2 mt-2"
                      : "mb-2 mt-2"
                  }
                  {...formik.getFieldProps("parentTask")}
                ></FormControl>
                <InputGroup.Append>
                  <Button
                    data-testid="searchParentTask"
                    variant="outline-primary"
                    onClick={searchParentTask}
                    disabled={formik.values.isParentTask}
                  >
                    <i className="fa fa-search"></i>
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <FormControl.Feedback type="invalid">
                {formik.errors.parentTask}
              </FormControl.Feedback>
              <FormLabel className="mt-2">Start Date</FormLabel>
              <FormControl
                placeholder="Start Date"
                name="startDate"
                type="date"
                disabled={formik.values.isParentTask}
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
              <FormLabel className="mt-2">End Date</FormLabel>
              <FormControl
                placeholder="End Date"
                name="endDate"
                type="date"
                disabled={formik.values.isParentTask}
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
              <FormLabel className="mt-2">Search User</FormLabel>
              <InputGroup>
                {formik.values.user && formik.values.user.firstName ? (
                  <FormLabel className="modal-label">{`${formik.values.user.firstName} ${formik.values.user.lastName}`}</FormLabel>
                ) : (
                  <FormLabel className="modal-label"></FormLabel>
                )}
                <FormControl
                  hidden
                  readOnly
                  name="user"
                  disabled={formik.values.isParentTask}
                  required={false}
                  errors={formik.errors.user}
                  className={
                    formik.touched.user
                      ? formik.errors.user
                        ? "is-invalid mb-2 mt-2"
                        : "is-valid mb-2 mt-2"
                      : "mb-2 mt-2"
                  }
                  {...formik.getFieldProps("user")}
                ></FormControl>
                <InputGroup.Append>
                  <Button
                    variant="outline-primary"
                    data-testid="searchUserBtn"
                    onClick={searchUser}
                    disabled={formik.values.isParentTask}
                  >
                    <i className="fa fa-search"></i>
                  </Button>
                </InputGroup.Append>
              </InputGroup>

              <FormControl.Feedback type="invalid">
                {formik.errors.user}
              </FormControl.Feedback>

              <div className="mt-5 mb-5 text-center">
                <Button
                  variant="primary"
                  disabled={!formik.isValid || !formik.dirty}
                  type="submit"
                  className="ml-2 mr-2"
                >
                  {editTaskObj && props.history.action === "PUSH"
                    ? "Update"
                    : "Add"}
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
                id="searchProject"
                heading="Serach Project"
                showModal={showProjectModal}
                onCloseModal={onCloseProjectModal}
                data={projectList}
                columns={[
                  { dataField: "_id", hidden: true },
                  { dataField: "projectName", text: "Project List" }
                ]}
                onSearch={data => {
                  onSearchProject(data, formik.setFieldValue);
                }}
              />

              <SearchModal
                id="searchUser"
                heading="Serach User"
                showModal={showUserModal}
                onCloseModal={onCloseUserModal}
                data={userList}
                columns={[
                  { dataField: "_id", hidden: true },
                  { dataField: "firstName", text: "User List" },
                  { dataField: "lastName", hidden: true }
                ]}
                onSearch={data => {
                  onSearchUser(data, formik.setFieldValue);
                }}
              />

              <SearchModal
                id="searchParentTask"
                heading="Serach Parent Task"
                showModal={showParentModal}
                onCloseModal={onCloseParentModal}
                data={parentTaskList}
                columns={[
                  { dataField: "_id", hidden: true },
                  { dataField: "taskName", text: "Parent Task List" } // Todo parentTask
                ]}
                onSearch={data => {
                  onSearchParent(data, formik.setFieldValue);
                }}
              />
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
};
