import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import {
  render,
  cleanup,
  wait,
  fireEvent,
  getByTestId
} from "@testing-library/react";
import ViewTask from "./ViewTask";
import axios from "axios";
jest.mock("axios");

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

  it("should not get any task before project selection", () => {
    const { container, getByText } = render(
      <Router>
        <ViewTask />
      </Router>
    );
    expect(
      getByText(
        "No task available for selected project, please select another project from the list"
      )
    );
  });

  // it("should load projects on search icon click", () => {
  //   let projectList = {
  //     data: [
  //       {
  //         _id: "5def0350ba3cb90f6c91ccc3",
  //         projectName: "New",
  //         priority: 23,
  //         dateRequired: false,
  //         task: [
  //           {
  //             _id: "5df2b9501eed66114ccd3f68",
  //             project: "5def0350ba3cb90f6c91ccc3",
  //             taskName: "Amit Task",
  //             isParentTask: true,
  //             __v: 0,
  //             status: "Completed",
  //             id: "5df2b9501eed66114ccd3f68"
  //           }
  //         ],
  //         id: "5def0350ba3cb90f6c91ccc3"
  //       },
  //       {
  //         _id: "5def099bba3cb90f6c91ccc5",
  //         projectName: "dege",
  //         priority: 54,
  //         dateRequired: false,
  //         __v: 0,
  //         task: [
  //           {
  //             _id: "5df2bbb61eed66114ccd3f6b",
  //             project: "5def099bba3cb90f6c91ccc5",
  //             taskName: "jooo",
  //             isParentTask: true,
  //             status: "Completed",
  //             id: "5df2bbb61eed66114ccd3f6b"
  //           }
  //         ],
  //         id: "5def099bba3cb90f6c91ccc5"
  //       }
  //     ]
  //   };
  //   const { container, getByTestId, getByText } = render(
  //     <Router>
  //       <ViewTask />
  //     </Router>
  //   );

  //   const searchModalIcon = getByTestId("searchIcon");
  //   fireEvent.click(searchModalIcon);
  //   // const getAllProjects = jest.fn();
  //   // axios.get.mockImplementationOnce(() =>
  //   //   Promise.resolve({ data: projectList })
  //   // );
  //   // expect(getByText("Search Project"));
  // });
});
