import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import Table from "./Table";

describe("Table Component", () => {
  afterEach(cleanup);
  const data = [{ projectName: "A" }, { projectName: "B" }];
  const columns = [{ dataField: "projectName", text: "Project List" }];
  const rowClickHandler = jest.fn();
  it("Should render Table component", () => {
    const { container } = render(<Table data={data} columns={columns} />);
    expect(container).toMatchSnapshot();
  });

  it("should click on row", () => {
    const { container, getByText } = render(
      <Table
        data={data}
        columns={columns}
        rowClickHandler={rowClickHandler(data[0].name)}
      />
    );
    const firstRow = getByText("A");
    fireEvent.click(firstRow);
    expect(container).toMatchSnapshot();
  });
});
