import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { render, cleanup, wait, fireEvent } from "@testing-library/react";
import { toBeDisabled, toBeEmpty } from "@testing-library/jest-dom";
expect.extend({ toBeDisabled, toBeEmpty });

import { AddTask } from "./AddTask";
import axios from "axios";
jest.mock("axios");

const fakeTaskName = "Task 01";
let userList = {
  data: [
    {
      _id: "5df53177f576f77b78e0e6d9",
      firstName: "User01",
      lastName: "01Last",
      empId: 1
    }
  ]
};

let paretntTaskList = {
  data: [{ _id: "5df5343af576f77b78e0e6df", taskName: "Parent Task 1" }]
};

let projectList = {
  data: [
    {
      _id: "5df532c1f576f77b78e0e6dc",
      projectName: "Project 01",
      priority: 24,
      dateRequired: true,
      manager: {
        _id: "5df53177f576f77b78e0e6d9",
        firstName: "User01",
        lastName: "user01lastName",
        empId: 1
      },
      endDate: "2019-12-21T00:00:00.000Z",
      startDate: "2019-12-14T00:00:00.000Z",
      task: [
        {
          _id: "5df5343af576f77b78e0e6e0",
          project: "5df532c1f576f77b78e0e6dc",
          taskName: "Parent Task 1 - p1u1(edited)",
          isParentTask: true,
          __v: 0,
          status: "Completed",
          id: "5df5343af576f77b78e0e6e0"
        }
      ],
      id: "5df532c1f576f77b78e0e6dc"
    }
  ]
};

let historyObjWithData = {
  action: "PUSH",
  location: {
    state: {
      _id: "5df5343af576f77b78e0e6e0",
      project: {
        _id: "5df532c1f576f77b78e0e6dc",
        projectName: "Project 01 - User 01",
        priority: 24,
        dateRequired: true,
        manager: "5df53177f576f77b78e0e6d9",
        endDate: "2019-12-21T00:00:00.000Z",
        startDate: "2019-12-14T00:00:00.000Z",
        id: "5df532c1f576f77b78e0e6dc"
      },
      taskName: "Parent Task 1 - p1u1(edited)",
      isParentTask: true,
      status: "Completed",
      parentTaskObj: {
        _id: "5df5343af576f77b78e0e6df",
        taskName: "Parent Task 1 - p1u1(edited)"
      },
      id: "5df5343af576f77b78e0e6e0"
    }
  }
};

describe("Add Task Component", () => {
  const historyObj = {
    location: {
      state: ""
    }
  };

  afterEach(cleanup);
  it("Should render AddTask component", () => {
    const { container } = render(
      <Router>
        <AddTask history={historyObj} />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });

  it("Should able to Edit task", () => {
    const { getByText, getByPlaceholderText } = render(
      <Router>
        <AddTask history={historyObjWithData} />
      </Router>
    );

    const updateButton = getByText("Update");
    const taskName = getByPlaceholderText("Task name");
    fireEvent.change(taskName, {
      target: { name: "taskName", value: fakeTaskName }
    });
    expect(updateButton).not.toBeDisabled();
    fireEvent.click(updateButton);
  });

  it("Should able to Search Manager", async () => {
    axios.get.mockResolvedValue(userList);
    const { getByText, getByTestId } = render(
      <Router>
        <AddTask history={historyObj} />
      </Router>
    );
    const searchUserBtn = getByTestId("searchUserBtn");
    expect(searchUserBtn).not.toBeDisabled();
    fireEvent.click(searchUserBtn);
    await wait(() => {
      expect(getByText("User01"));
      const selectParentTask = getByText("User01");
      fireEvent.click(selectParentTask);
    });
  });

  it("Should able to Search Parent Task", async () => {
    axios.get.mockResolvedValue(paretntTaskList);
    const { container, getByText, getByTestId } = render(
      <Router>
        <AddTask history={historyObj} />
      </Router>
    );
    const searchParentTaskBtn = getByTestId("searchParentTask");
    expect(searchParentTaskBtn).not.toBeDisabled();
    fireEvent.click(searchParentTaskBtn);
    await wait(() => {
      expect(getByText("Parent Task 1"));
      const selectParentTask = getByText("Parent Task 1");
      fireEvent.click(selectParentTask);
    });
  });

  it("Should able to Search Project", async () => {
    axios.get.mockResolvedValue(projectList);
    const { getByTestId } = render(
      <Router>
        <AddTask history={historyObj} />
      </Router>
    );
    const searchProjectBtn = getByTestId("searchProjectBtn");
    expect(searchProjectBtn).not.toBeDisabled();
    fireEvent.click(searchProjectBtn);
  });

  it("Should able to Reset Task Form ", async () => {
    const { getByText, getByPlaceholderText } = render(
      <Router>
        <AddTask history={historyObj} />
      </Router>
    );
    const taskName = getByPlaceholderText("Task name");
    fireEvent.change(taskName, {
      target: { name: "taskName", value: fakeTaskName }
    });
    const resetBtn = getByText("Reset");
    expect(resetBtn).not.toBeDisabled();
    fireEvent.click(resetBtn);
    expect(taskName).toBeEmpty();
  });
});
