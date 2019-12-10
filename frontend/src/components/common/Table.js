import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";

const Table = props => {
  const { SearchBar } = Search;
  const { data, columns, keyField, search, clickedRow } = props;
  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      if (clickedRow) {
        clickedRow(row, rowIndex);
      }
    }
  };
  const rowStyle = clickedRow ? { cursor: "pointer" } : { cursor: "default" };
  return (
    <ToolkitProvider keyField="id" data={data} columns={columns} search>
      {props => (
        <div>
          <SearchBar {...props.searchProps} />
          <hr />
          <BootstrapTable
            striped
            condensed
            rowEvents={rowEvents}
            rowStyle={rowStyle}
            noDataIndication="No records"
            {...props.baseProps}
          />
        </div>
      )}
    </ToolkitProvider>
  );
};

export default Table;
