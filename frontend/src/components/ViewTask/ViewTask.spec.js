import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { render, cleanup } from "@testing-library/react";
import { ViewTask } from "./ViewTask";

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
});
