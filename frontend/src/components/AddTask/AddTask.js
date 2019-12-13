import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  FormControl,
  Button,
  Alert,
  Form,
  Modal,
  FormLabel,
  InputGroup
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import SearchModal from "../common/SearchModal";
import {
  addNewTask,
  getAllUsers,
  getAllProject,
  getAllParentTasks,
  addParentTask
} from "../../api/Api";
import * as moment from "moment";
import "./AddTask.scss";

export const AddTask = () => {
  const initialStartDate = formatDate(new Date());
  const initialEndDate = formatDate(getAfterDate(1));

  let [taskName, setTaskName] = useState("");

  let [startDate, setStartDate] = useState(initialStartDate);
  let [endDate, setEndDate] = useState(initialEndDate);
  let [isParentTask, setIsParentTask] = useState(false);

  let [priority, setPriority] = useState("");
  let [statusMessage, setStatusMessage] = useState({
    show: false,
    message: "",
    variant: ""
  });

  let [user, setUser] = useState("");
  let [userList, setUserList] = useState([]);
  let [showUserModal, setShowUserModal] = useState(false);

  let [project, setProject] = useState("");
  let [projectList, setProjectList] = useState([]);
  let [showProjectModal, setShowProjectModal] = useState(false);

  let [parentTask, setParentTask] = useState({});
  let [parentTaskList, setParentTaskList] = useState([]);
  let [showParentModal, setShowParentModal] = useState(false);

  //Call this function after setStatusMessag to autoHide alert message
  function autoHideAlert() {
    setTimeout(() => {
      setStatusMessage({
        ...statusMessage,
        show: false
      });
    }, 5000);
  }

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
    setProjectList(await getAllProject());
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
      project: project,
      parentTask: parentTask,
      user: user,
      taskName: taskName,
      startDate: startDate,
      endDate: endDate,
      priority: priority,
      isParentTask: isParentTask
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
          const resp = await addParentTask(value);
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
        const resp = await addNewTask(value);
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
              <InputGroup>
                {formik.values.project.projectName ? (
                  <FormLabel className="modal-label">{`${formik.values.project.projectName}`}</FormLabel>
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
                  <Button variant="outline-primary" onClick={searchProject}>
                    Search Project
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <FormControl.Feedback type="invalid">
                {formik.errors.project}
              </FormControl.Feedback>

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

              <Form.Check
                type="checkbox"
                name="isParentTask"
                value={formik.values.isParentTask}
                checked={formik.values.isParentTask}
                label="Parent Task"
                {...formik.getFieldProps("isParentTask")}
              />
              <FormLabel>Priority</FormLabel>
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
                    variant="outline-primary"
                    onClick={searchParentTask}
                    disabled={formik.values.isParentTask}
                  >
                    Search Parent Task
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <FormControl.Feedback type="invalid">
                {formik.errors.parentTask}
              </FormControl.Feedback>

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
              <InputGroup>
                {formik.values.user && formik.values.user.firstName ? (
                  <FormLabel className="modal-label">{`${formik.values.user.firstName} ${formik.values.user.lastName}`}</FormLabel>
                ) : (
                  <FormLabel className="modal-label"></FormLabel>
                )}
                <FormControl
                  required
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
                    onClick={searchUser}
                    disabled={formik.values.isParentTask}
                  >
                    Search User
                  </Button>
                </InputGroup.Append>
              </InputGroup>

              <FormControl.Feedback type="invalid">
                {formik.errors.user}
              </FormControl.Feedback>

              <div className="float-right mt-4">
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
