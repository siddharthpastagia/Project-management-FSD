import React from "react";
import { Modal } from "react-bootstrap";
import Table from "./Table";

const SearchModal = props => {
  const onSelectItem = selectedItem => {
    props.onSearch(selectedItem);
    props.onCloseModal();
  };

  return (
    <Modal show={props.showModal} onHide={props.onCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{props.heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table
          columns={props.columns}
          data={props.data}
          keyField="id"
          rowClickHandler={onSelectItem}
        />
      </Modal.Body>
    </Modal>
  );
};
export default SearchModal;
