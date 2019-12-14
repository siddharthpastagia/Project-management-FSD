import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { render, cleanup } from "@testing-library/react";
import { AddUser } from "./AddUser";

describe("Add User Component", () => {
  afterEach(cleanup);
  it("Should render Add User component", () => {
    const { container } = render(
      <Router>
        <AddUser />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
});
