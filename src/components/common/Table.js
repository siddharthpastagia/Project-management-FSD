import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";

const Table = props => {
  const { SearchBar } = Search;
  const { data, columns, keyField, search } = props;
  return (
    <ToolkitProvider keyField="id" data={data} columns={columns} search>
      {props => (
        <div>
          <SearchBar {...props.searchProps} />
          <hr />
          <BootstrapTable
            striped
            condensed
            noDataIndication="No records"
            {...props.baseProps}
          />
        </div>
      )}
    </ToolkitProvider>
  );
};

export default Table;
