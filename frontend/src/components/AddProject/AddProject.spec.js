import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { render, cleanup } from "@testing-library/react";
import { AddProject } from "./AddProject";

describe("Add Project Component", () => {
  afterEach(cleanup);
  it("Should render AddProject component", () => {
    const { container } = render(
      <Router>
        <AddProject />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
});
