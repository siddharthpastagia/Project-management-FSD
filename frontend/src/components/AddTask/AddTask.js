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
import { addNewTask } from "../../api/Api";
import * as moment from "moment";
import { func } from "prop-types";

export const AddTask = () => {
  const initialStartDate = formatDate(new Date());
  const initialEndDate = formatDate(getAfterDate(1));

  let [taskId, setTaskId] = useState("");
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
    setTaskName("");
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setPriority("");
    setUser("");
    setIsParentTask(false);
  }

  function getAfterDate(num) {
    return moment().add(num, "day");
  }

  function formatDate(date) {
    return moment(date).format("YYYY-MM-DD");
  }

  let [showUserModal, setShowUserModal] = useState(false);
  let [showProjectModal, setShowProjectModal] = useState(false);
  let [showParentModal, setShowParentModal] = useState(false);

  let [user, setUser] = useState("");

  function onCloseManagerModal(val) {
    setShowUserModal(false);
  }

  function onCloseProjectModal(val) {
    setShowProjectModal(false);
  }

  function onCloseParentModal(val) {
    setShowParentModal(false);
  }
  function onSearchManager(data, setFieldValue) {
    setFieldValue("user", data.name);
  }

  function onSearchProject(data, setFieldValue) {
    setFieldValue("project", data.name);
  }

  function onSearchParent(data, setFieldValue) {
    setFieldValue("parent", data.name);
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      taskId: taskId,
      taskName: taskName,
      startDate: startDate,
      endDate: endDate,
      priority: priority,
      isParentTask: isParentTask,
      user: user
    },
    validationSchema: Yup.object({
      project: Yup.string().required("Please select Project"),
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
      parent: Yup.string().when("isParentTask", {
        is: false,
        then: Yup.string().required("Please select parent task from serach"),
        otherwise: Yup.string()
      })
    }),
    onSubmit: async value => {
      if (value.isParentTask) {
        delete value.startDate;
        delete value.endDate;
        delete value.priority;
        delete value.user;
        delete value.parent;
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
                <FormControl
                  required
                  readOnly
                  name="project"
                  required
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
                    onClick={() => {
                      setShowProjectModal(true);
                    }}
                  >
                    Search Project
                  </Button>
                </InputGroup.Append>
              </InputGroup>

              <FormControl.Feedback type="invalid">
                {formik.errors.user}
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
                {formik.errors.priority}
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
                <FormControl
                  required
                  readOnly
                  name="parent"
                  disabled={formik.values.isParentTask}
                  required={false}
                  errors={formik.errors.parent}
                  className={
                    formik.touched.parent
                      ? formik.errors.parent
                        ? "is-invalid mb-2 mt-2"
                        : "is-valid mb-2 mt-2"
                      : "mb-2 mt-2"
                  }
                  {...formik.getFieldProps("parent")}
                ></FormControl>
                <InputGroup.Append>
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      setShowParentModal(true);
                    }}
                  >
                    Search Parent Task
                  </Button>
                </InputGroup.Append>
              </InputGroup>

              <FormControl.Feedback type="invalid">
                {formik.errors.user}
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
                <FormControl
                  required
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
                    onClick={() => {
                      setShowUserModal(true);
                    }}
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
                id="searchManager"
                heading="Serach Manager"
                showModal={showUserModal}
                onCloseModal={onCloseManagerModal}
                data={[
                  { name: "SHREE", id: "1" },
                  { name: "OM", id: "2" }
                ]}
                onSearch={data => {
                  onSearchManager(data, formik.setFieldValue);
                }}
              />
              <SearchModal
                id="searchProject"
                heading="Serach Project"
                showModal={showProjectModal}
                onCloseModal={onCloseProjectModal}
                data={[
                  { name: "Project A", id: "1" },
                  { name: "Project B", id: "2" }
                ]}
                onSearch={data => {
                  onSearchProject(data, formik.setFieldValue);
                }}
              />
              <SearchModal
                id="searchParent"
                heading="Serach Parent Task"
                showModal={showParentModal}
                onCloseModal={onCloseParentModal}
                data={[
                  { name: "Parent A", id: "1" },
                  { name: "Parent B", id: "2" }
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
