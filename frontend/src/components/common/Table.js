import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";

const Table = props => {
  const { SearchBar } = Search;
  const { data, columns, keyField, search, rowClickHandler } = props;
  const rowStyle = rowClickHandler
    ? { cursor: "pointer" }
    : { cursor: "default" };

  const rowClickEvents = {
    onClick: (e, row, rowIndex) => {
      if (rowClickHandler) {
        rowClickHandler(row, rowIndex);
      }
    }
  };

  return (
    <ToolkitProvider keyField="id" data={data} columns={columns} search>
      {props => (
        <div>
          <SearchBar {...props.searchProps} />
          <hr />
          <BootstrapTable
            striped
            condensed
            rowStyle={rowStyle}
            rowEvents={rowClickEvents}
            noDataIndication="No records found!!"
            {...props.baseProps}
          />
        </div>
      )}
    </ToolkitProvider>
  );
};

export default Table;
