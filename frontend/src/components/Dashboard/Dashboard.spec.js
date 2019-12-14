import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { render, cleanup } from "@testing-library/react";
import { Dashboard } from "./Dashboard";

describe("Dashboard Component", () => {
  afterEach(cleanup);
  it("Should render Home component", () => {
    const { container } = render(
      <Router>
        <Dashboard />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
});
