import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Table from "./Table";

const SearchModal = props => {
  const columns = [{ dataField: "name", text: "Project Name" }];
  const onSelectItem = row => {
    props.onSearch(row);
    props.onCloseModal();
  };

  return (
    <Modal show={props.showModal} onHide={props.onCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{props.heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <div
          onClick={() => {
            onSelectItem(props.data[0]);
          }}
        > */}
        <Table
          columns={columns}
          data={props.data}
          keyField="id"
          clickedRow={onSelectItem}
        />

        {/* </div> */}
      </Modal.Body>
    </Modal>
  );
};
export default SearchModal;
