import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Navbar, Nav, Button } from 'react-bootstrap';
import {SocketContext, socket} from '../../context/socket.js';
import { ArrowRightCircle     } from 'react-bootstrap-icons'

export default function ShowStatistics() {
  const socket = useContext(SocketContext);
  const history = useHistory();

  const handleLogout = () => {
    console.log("Click on log out")
    localStorage.clear();
    history.push("/")
    socket.emit("log_disconnect")
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand style={{fontSize: 28, paddingLeft: 30}}>My coin</Navbar.Brand>
        <Nav className="nav_item">
          <Nav.Link className="navlink_item" href="/dashboard" style={{paddingLeft: 40, fontSize: 20}}>Dashboard</Nav.Link>
          <Nav.Link className="navlink_item" href="/send" style={{paddingLeft: 40, fontSize: 20}}>Send</Nav.Link>
          <Nav.Link className="navlink_item" href="/statistics" style={{paddingLeft: 40, fontSize: 20}}>Blocks and Transactions</Nav.Link>
          <Button bg="dark" variant="dark" className="logoutButton" onClick={handleLogout}>
            <ArrowRightCircle style={{width: 30, height: 30}}   />
          </Button>
        </Nav>
      </Navbar>
      <br />
      <p>Show statistics</p>
      <br></br>
      <footer className="footer" style={{position: "relative", top: 150, paddingBottom: 20, textAlign: "center"}}>
        <div>
          <a href="https://coreui.io">CoreUI</a>
          <span>&copy; 2020 creativeLabs.</span>
        </div>
        <div className="ml-auto">
          <span>Powered by</span>
          <a href="https://coreui.io">CoreUI</a>
        </div>
      </footer>
    </>
  );
}