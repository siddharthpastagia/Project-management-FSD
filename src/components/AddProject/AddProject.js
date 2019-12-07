import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import Table from "../common/Table";

export const AddProject = () => {
  const [projectModal, setProjectModal] = useState(false);
  const columns = [{ dataField: "name", text: "Project Name" }];
  const projects = [
    { name: "Project A", id: "1" },
    { name: "Project B", id: "2" },
    { name: "Project C", id: "3" },
    { name: "Project D", id: "4" },
    { name: "Project E", id: "5" }
  ];
  return (
    <>
      <Modal
        show={projectModal}
        onHide={() => {
          setProjectModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Projects</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table columns={columns} data={projects} keyField="id" />
        </Modal.Body>
      </Modal>
      This is Add project screen
      <Button variant="outline-info" onClick={() => setProjectModal(true)}>
        Open Modal
      </Button>
    </>
  );
};
