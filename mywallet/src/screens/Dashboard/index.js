import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import {SocketContext, socket} from '../../context/socket.js';
const fs = require('browserify-fs');

export default function Dashboard() {
  const socket = useContext(SocketContext);
  const [data, setData] = useState({});
  const history = useHistory();

  const handleLogout = () => {
    console.log("Click on log out")
    localStorage.setItem("privateKey", null);
    console.log(localStorage.getItem("privateKey"))
    history.push("/")
  };

  useEffect(()=>
    fetch("http://localhost:3001/syncdata")
    .then(
        res => res.json())
    .then(
        (result) => {
          localStorage.setItem("data", result.result);
          socket.emit("local_data", result.result);
        },
        (error) => {
          console.log(error)
        }
    ),[])

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
      <p>{localStorage.getItem("privateKey")}</p>
    </>
  );
}