import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Navbar, Nav, Button, Card, Row, Col } from 'react-bootstrap';
import {SocketContext, socket} from '../../context/socket.js';
import addressIcon from '../../img/addressIcon.png';
import balanceIcon from '../../img/balanceIcon.png';
import { ArrowRightCircle     } from 'react-bootstrap-icons'
const fs = require('browserify-fs');

export default function Dashboard() {
  const socket = useContext(SocketContext);
  const history = useHistory();
  const [amount, setAmount] = useState();
  const [loaded, setLoaded] = useState(false);

  const handleLogout = () => {
    console.log("Click on log out")
    localStorage.clear();
    history.push("/")
    socket.emit("log_disconnect")
  };

  useEffect(()=>{
    if (!loaded) {
      socket.emit("log_connect")
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
          <Button bg="dark" variant="dark" className="logoutButton" onClick={handleLogout}>
            <ArrowRightCircle style={{width: 30, height: 30}}   />
          </Button>
        </Nav>
      </Navbar>
      <br />
      <div>
        <Row style={{width: "80%"}}>
          <Col style={{marginLeft: "12%"}}>
            <Card className="card_item">
              <Card.Img variant="top" src={addressIcon} style={{width: 250, height: 250, objectFit: "cover", marginTop: 30, marginLeft: 80}} />
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
              <Card.Img variant="top" src={balanceIcon} style={{width: 250, height: 250, objectFit: "cover", marginTop: 30, marginLeft: 80}} />
              <Card.Body>
                <Card.Title>Balance</Card.Title>
                <Card.Text style={{fontSize: 28, color: "#ff0000", fontStyle: "italic"}}>
                  {amount} VNĐ
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
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