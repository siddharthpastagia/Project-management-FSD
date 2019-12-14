const axios = require("axios");

const apiPath = process.env.REACT_APP_API_PATH;
const headers = {
  Accept: "application/json, text/plain,*/*",
  "Content-Type": "application/json"
};

//------------------------------------------------------------
//User
export const getAllUsers = async () => {
  return axios
    .get(`${apiPath}/user`, { headers: headers })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};
export const addNewUser = async user => {
  return axios
    .post(`${apiPath}/user/add`, user, { headers: headers })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};

export const updateUserById = async user => {
  return axios
    .put(`${apiPath}/user/update/${user.userId}`, user, { headers: headers })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};

export const deleteUserById = async user => {
  return axios
    .get(`${apiPath}/user/delete/${user._id}`, user, { headers: headers })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};
//-------------------------------------------------------------------------
//Project
export const getAllProject = async () => {
  return axios
    .get(`${apiPath}/project`, { headers: headers })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};
export const addNewProject = async project => {
  return axios
    .post(`${apiPath}/project/add`, project, { headers: headers })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};

export const updateProjectById = async project => {
  return axios
    .put(`${apiPath}/project/update/${project.projectId}`, project, {
      headers: headers
    })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};

export const deleteProjectById = async project => {
  return axios
    .get(`${apiPath}/project/delete/${project._id}`, project, {
      headers: headers
    })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};
//-----------------------------------------------------------------------------
// Tasks

// Add task

export const addNewTask = async task => {
  return axios
    .post(`${apiPath}/task/add`, task, { headers: headers })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};

// get task by project Id

export const getAllTasksByProjectId = async project => {
  return axios
    .get(`${apiPath}/task/project/${project._id}`, { headers: headers })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};

export const getTaskById = async taskId => {
  return axios
    .get(`${apiPath}/task/${taskId}`, { headers: headers })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};

// get all tasks

export const getAllTasks = async () => {
  return axios
    .get(`${apiPath}/task`, { headers: headers })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};

// complete task
export const updateTaskAsComplete = async task => {
  return axios
    .put(`${apiPath}/task/complete/${task._id}`, task, {
      headers: headers
    })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};

// update task by id

export const updateTaskById = async task => {
  return axios
    .put(`${apiPath}/task/update/${task._id}`, task, {
      headers: headers
    })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};

// add parent task

// Add task

export const addParentTask = async task => {
  return axios
    .post(`${apiPath}/parentTask/add`, task, { headers: headers })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};

// get all parent tasks

export const getAllParentTasks = async () => {
  return axios
    .get(`${apiPath}/parentTask`, { headers: headers })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};

// update parent task by id

export const updateParentTaskById = async parentTask => {
  return axios
    .put(
      `${apiPath}/parentTask/update/${parentTask.parentTaskId}`,
      parentTask,
      {
        headers: headers
      }
    )
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));
};
