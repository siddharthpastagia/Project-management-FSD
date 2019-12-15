import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { render, cleanup, wait, fireEvent } from "@testing-library/react";
import { toBeDisabled, toBeEmpty } from "@testing-library/jest-dom";
expect.extend({ toBeDisabled, toBeEmpty });

import ViewTask from "./ViewTask";

import axios from "axios";
jest.mock("axios");

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

let taskList = {
  data: [
    {
      _id: "5df534a2f576f77b78e0e6e1",
      project: "5df532c1f576f77b78e0e6dc",
      parentTask: {
        _id: "5df5343af576f77b78e0e6df",
        taskName: "Parent Task 1 - p1u1(edited)"
      },
      user: "5df53177f576f77b78e0e6d9",
      taskName: "Task 01",
      startDate: "2019-12-13T00:00:00.000Z",
      endDate: "2020-12-14T00:00:00.000Z",
      priority: 22,
      isParentTask: false,
      id: "5df534a2f576f77b78e0e6e1"
    }
  ]
};
describe("View Task Component", () => {
  afterEach(cleanup);
  it("Should render ViewTask component", () => {
    const { container } = render(
      <Router>
        <ViewTask />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });

  it("Should able to Search Project & Sort Task", async () => {
    axios.get.mockResolvedValue(projectList);
    const { getByText, getByTestId } = render(
      <Router>
        <ViewTask />
      </Router>
    );
    const searchProjectBtn = getByTestId("searchIcon");
    expect(searchProjectBtn).not.toBeDisabled();
    fireEvent.click(searchProjectBtn);
    await wait(() => {
      expect(getByText("Project 01"));
      const selectProject = getByText("Project 01");
      axios.get.mockResolvedValue(taskList);
      fireEvent.click(selectProject);
    });
    const sortStartDateBtn = getByTestId("sortStartDate");
    const sortEndDateBtn = getByTestId("sortEndDate");
    const sortPriorityBtn = getByTestId("sortPriority");

    fireEvent.click(sortStartDateBtn);
    fireEvent.click(sortEndDateBtn);
    fireEvent.click(sortPriorityBtn);
    expect(sortStartDateBtn).not.toBeDisabled();
  });

  it("Should able to Edit Task", async () => {
    axios.get.mockResolvedValue(projectList);
    const { getByText, getByTestId } = render(
      <Router>
        <ViewTask />
      </Router>
    );
    const searchProjectBtn = getByTestId("searchIcon");
    expect(searchProjectBtn).not.toBeDisabled();
    fireEvent.click(searchProjectBtn);
    await wait(() => {
      expect(getByText("Project 01"));
      const selectProject = getByText("Project 01");
      axios.get.mockResolvedValue(taskList);
      fireEvent.click(selectProject);
    });
    const EditBtn = getByText("Edit");
    fireEvent.click(EditBtn);
  });

  it("Should able to End Task", async () => {
    axios.get.mockResolvedValue(projectList);
    const { getByText, getByTestId } = render(
      <Router>
        <ViewTask />
      </Router>
    );
    const searchProjectBtn = getByTestId("searchIcon");
    expect(searchProjectBtn).not.toBeDisabled();
    fireEvent.click(searchProjectBtn);
    await wait(() => {
      expect(getByText("Project 01"));
      const selectProject = getByText("Project 01");
      axios.get.mockResolvedValue(taskList);
      fireEvent.click(selectProject);
    });
    axios.put.mockResolvedValue({
      data: { message: "Task Completed successfully" }
    });

    const endTaskBtn = getByText("End Task");
    fireEvent.click(endTaskBtn);
  });
});
