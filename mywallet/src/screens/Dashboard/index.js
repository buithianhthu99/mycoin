import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Navbar, Nav, Dropdown, Card, Row, Col } from 'react-bootstrap';
import {SocketContext, socket} from '../../context/socket.js';
const fs = require('browserify-fs');

export default function Dashboard() {
  const socket = useContext(SocketContext);
  const history = useHistory();
  const [amount, setAmount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const handleLogout = () => {
    console.log("Click on log out")
    localStorage.setItem("privateKey", null);
    console.log(localStorage.getItem("privateKey"))
    history.push("/")
  };

  useEffect(()=>{
    if (!loaded) {
      fetch("http://localhost:3001/syncdata")
      .then(
          res => res.json())
      .then(
          (result) => {
            localStorage.setItem("data", result.result);
            socket.emit("local_data", result.result);
            setLoaded(true);
          },
          (error) => {
            console.log(error)
          })
    }
    else {
      socket.emit("getAmount", {socketId: socket.id, address: localStorage.getItem("address")})
      console.log(socket.id)
      socket.on("getAmount", (data) => {
        setAmount(data);
        localStorage.setItem("balance", data);
        console.log(`Amount: ${data}`);
      })
    }
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
              <Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>
      <br />
      <div>
        <Row style={{width: "70%"}}>
          <Col style={{marginLeft: "20%"}}>
            <Card className="card_item">
              <Card.Img variant="top" src="https://i.pinimg.com/originals/f6/b0/9e/f6b09e1dbbfe0e6e3e15c40499d1d437.png" />
              <Card.Body>
                <Card.Title>Address</Card.Title>
                <Card.Text style={{fontSize: 15, fontStyle: "italic"}}>
                  {localStorage.getItem("address")}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col >
            <Card className="card_item">
              <Card.Img variant="top" src="https://cdn.dribbble.com/users/2912503/screenshots/7153341/wallet.jpg" />
              <Card.Body>
                <Card.Title>Balance</Card.Title>
                <Card.Text style={{fontSize: 28, color: "#ff0000", fontStyle: "italic"}}>
                  {localStorage.getItem("balance")} VNĐ
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <br></br>
      <footer class="footer" style={{position: "relative", top: 100, textAlign: "center"}}>
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