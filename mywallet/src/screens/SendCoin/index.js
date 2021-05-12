import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Navbar, Modal, Button, Form, Row, Col, Nav, Dropdown } from 'react-bootstrap';
import {SocketContext, socket} from '../../context/socket.js';

export default function SendCoin() {
  const [show, setShow] = useState(false);
  const socket = useContext(SocketContext);
  const history = useHistory();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState(0);

  const handleLogout = () => {
    console.log("Click on log out")
    localStorage.setItem("privateKey", null);
    console.log(localStorage.getItem("privateKey"))
    history.push("/")
  };

  const checkValidForm = () => {

  }

  const createClick = () => {
    if (checkValidForm()) {
      handleShow()
    }
    else {
      console.log("Form input not valid")
    }
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand style={{fontSize: 28, paddingLeft: 30}}>My coin</Navbar.Brand>
        <Nav className="nav_item">
          <Nav.Link className="navlink_item" href="/dashboard" style={{paddingLeft: 40, fontSize: 20}}>Dashboard</Nav.Link>
          <Nav.Link className="navlink_item" href="/send" style={{paddingLeft: 40, fontSize: 20}}>Send</Nav.Link>
          <Nav.Link className="navlink_item" href="/statistics" style={{paddingLeft: 40, fontSize: 20}}>Blocks and Transactions</Nav.Link>
          <Dropdown className="dropdown">
            <Dropdown.Toggle variant="success" id="dropdown-basic"/>
            <Dropdown.Menu align="right">
              <Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>
      <br />
      <label className="center" style={{fontSize: 28, fontWeight: "bold"}}>CREATE NEW TRANSACTION</label>
      <Form className="inputForm">
        <Form.Group as={Row} controlId="formPlaintextAddress">
          <Form.Label column sm="2">
            To address
          </Form.Label>
          <Col sm="10">
            <Form.Control onChange={e => setToAddress(e.target.value)} type="text" placeholder="address"  /> 
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formPlaintextAmount">
          <Form.Label column sm="2">
            Amount
          </Form.Label>
          <Col sm="10">
            <Form.Control onChange={e => setAmount(e.target.value)} type="number" placeholder="amount" />
          </Col>
        </Form.Group>
      </Form>
      <Button className="create_button" variant="primary" onClick={handleShow}>
          Create
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Sign transaction</Modal.Title>
          </Modal.Header>
          <Modal.Body>Please confirm if you want to sign this transaction</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      <br></br>
      <footer class="footer" style={{position: "relative", top: 440, paddingBottom: 20, textAlign: "center"}}>
        <div>
          <a href="https://coreui.io">CoreUI</a>
          <span>&copy; 2020 creativeLabs.</span>
        </div>
        <div class="ml-auto">
          <span>Powered by</span>
          <a href="https://coreui.io">CoreUI</a>
        </div>
      </footer>
    </>
  );
}