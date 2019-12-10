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
