import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { render, cleanup, wait } from "@testing-library/react";
import { AddProject } from "./AddProject";

describe("Add Project Component", () => {
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
});
