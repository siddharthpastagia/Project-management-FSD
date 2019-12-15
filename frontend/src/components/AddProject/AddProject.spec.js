import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { render, cleanup, wait, fireEvent } from "@testing-library/react";
import { toBeDisabled, toBeEmpty } from "@testing-library/jest-dom";
expect.extend({ toBeDisabled, toBeEmpty });
import { AddProject } from "./AddProject";

import axios from "axios";
jest.mock("axios");

describe("Add Project Component", () => {
  const onSubmit = jest.fn();
  const fakeProjectName = "ProjectA";
  const fakePriority = 11;
  const fakeManager = "";

  let projectList = {
    data: [
      {
        _id: "5df532c1f576f77b78e0e6dc",
        projectName: "ProjectA",
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

  const updateProjectResp = {
    data: {
      _id: "5df532c1f576f77b78e0e6dc",
      projectName: "ProjectA",
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
  };

  beforeEach(() => {
    axios.get.mockResolvedValue(projectList);
  });

  afterEach(cleanup);

  it("Should render AddProject component", async () => {
    const { container } = render(
      <Router>
        <AddProject />
      </Router>
    );
    await wait(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it("Get project List ", async () => {
    axios.get.mockResolvedValue({ data: [{}] });
    const { getByText } = render(
      <Router>
        <AddProject />
      </Router>
    );
    expect(getByText("Projects are not available in database!!"));
  });

  it("Should able to Search Manager", async () => {
    const { container, getByText, getByTestId } = render(
      <Router>
        <AddProject />
      </Router>
    );
    const serachManagerBtn = getByTestId("searchManagerBtn");
    expect(serachManagerBtn).not.toBeDisabled();
    fireEvent.click(serachManagerBtn);
  });

  it("Should able to Suspend Project ", async () => {
    const { getByText } = render(
      <Router>
        <AddProject />
      </Router>
    );
    await wait(() => {
      const suspendBtn = getByText("Suspend");
      expect(suspendBtn).not.toBeDisabled();
      fireEvent.click(suspendBtn);
    });
  });

  it("Should able to Update Project ", async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <Router>
        <AddProject />
      </Router>
    );
    let projectName, priority;
    await wait(() => {
      projectName = getByPlaceholderText("Project Name");
      priority = getByTestId("priorityField");
      const updateBtn = getByText("Update");
      axios.get.mockResolvedValue(updateProjectResp);
      fireEvent.click(updateBtn);
    });

    const updateProjectBtn = getByTestId("updateProject");
    fireEvent.change(projectName, {
      target: { name: "projectName", value: fakeProjectName }
    });
    fireEvent.change(priority, {
      target: { name: "priority", value: fakePriority }
    });
    fireEvent.click(updateProjectBtn);
  });

  it("Should able to Reset Project Form ", async () => {
    const { getByText, getByPlaceholderText } = render(
      <Router>
        <AddProject />
      </Router>
    );
    const projectName = getByPlaceholderText("Project Name");
    fireEvent.change(projectName, {
      target: { name: "projectName", value: fakeProjectName }
    });
    const resetBtn = getByText("Reset");
    expect(resetBtn).not.toBeDisabled();
    fireEvent.click(resetBtn);
    expect(projectName).toBeEmpty();
  });

  it("Should able to Serach the project from project List ", async () => {
    const { container, getByText, getByPlaceholderText } = render(
      <Router>
        <AddProject />
      </Router>
    );
    await wait(() => {
      const searchInp = getByPlaceholderText("Search");
      fireEvent.change(searchInp, {
        target: { name: "search", value: "ProjectA" }
      });
    });
    expect(getByText("Project : ProjectA"));
  });
  it("Should able to click on sorting options ", async () => {
    const { getByText, getByTestId } = render(
      <Router>
        <AddProject />
      </Router>
    );
    await wait(() => {
      const sortStartDateBtn = getByTestId("sortStartDate");
      const sortEndDateBtn = getByTestId("sortEndDate");
      const sortPriorityBtn = getByTestId("sortPriority");

      fireEvent.click(sortStartDateBtn);
      fireEvent.click(sortEndDateBtn);
      fireEvent.click(sortPriorityBtn);
      expect(sortStartDateBtn).not.toBeDisabled();
    });
    expect(getByText("Project : ProjectA"));
  });
});
