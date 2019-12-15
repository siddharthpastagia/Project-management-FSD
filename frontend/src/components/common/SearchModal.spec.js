import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import SearchModal from "./SearchModal";

describe("Search Modal Component", () => {
  afterEach(cleanup);
  let showModal = true;
  const data = [{ projectName: "A" }, { projectName: "B" }];
  const columns = [{ dataField: "projectName", text: "Project List" }];
  const onCloseModal = jest.fn();
  const onSearch = jest.fn();
  it("Should render Search Modal component", () => {
    const { container } = render(<SearchModal />);
    expect(container).toMatchSnapshot();
  });

  it("should handle onSearch prop", () => {
    const { container, getByText } = render(
      <SearchModal
        showModal={showModal}
        data={data}
        columns={columns}
        onCloseModal={() => (showModal = false)}
        onSearch={() => onSearch(data[0].projectName)}
      />
    );
    const firstRow = getByText("A");
    fireEvent.click(firstRow);
    expect(container).toMatchSnapshot();
  });
});
