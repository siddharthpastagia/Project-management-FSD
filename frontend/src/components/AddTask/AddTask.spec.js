import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { render, cleanup } from "@testing-library/react";
import { AddTask } from "./AddTask";

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
});
