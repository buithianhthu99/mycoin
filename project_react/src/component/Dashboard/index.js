import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import {SocketContext, socket} from '../../context/socket.js';

export default function Dashboard() {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState(0);

  const handle_get_message = useCallback((message) => {
    setMessage(message);
  }, []);

  useEffect(()=>{
    socket.emit("address", localStorage.getItem("address"));
  })

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
              <Dropdown.Item href="/">Log out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>
      <br />
    </>
  );
}