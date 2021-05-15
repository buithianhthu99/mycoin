import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router';
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Navbar, Nav, Button, Row, Col, Table } from 'react-bootstrap';
import {SocketContext, socket} from '../../context/socket.js';
import { ArrowRightCircle     } from 'react-bootstrap-icons'

export default function Transaction() {
  let {id} = useParams();
  const socket = useContext(SocketContext);
  const history = useHistory();
  const [block, setBlock] = useState({});

  const handleLogout = () => {
    console.log("Click on log out")
    localStorage.clear();
    history.push("/")
    socket.emit("log_disconnect")
  };

  useEffect(()=>{
    socket.emit("get_all_blocks")
    socket.on("blocks", (data) => {
      setBlock(data["result"][id-1]);
      console.log(block);
    })
  },[])

  const dateTimeReviver = (value) => {
    var d = new Date(value);
    var formattedDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
    var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
    var formattedTime = hours + ":" + minutes;

    formattedDate = formattedDate + " " + formattedTime;
    return formattedDate;
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand style={{fontSize: 28, paddingLeft: 30}}>My coin</Navbar.Brand>
        <Nav className="nav_item">
          <Nav.Link className="navlink_item" href="/dashboard" style={{paddingLeft: 40, fontSize: 20}}>Dashboard</Nav.Link>
          <Nav.Link className="navlink_item" href="/send" style={{paddingLeft: 40, fontSize: 20}}>Send</Nav.Link>
          <Nav.Link className="navlink_item" href="/statistics" style={{paddingLeft: 40, fontSize: 20}}>Blocks and Transactions</Nav.Link>
          <Nav.Link className="navlink_item" href="/mine" style={{paddingLeft: 40, fontSize: 20}}>Mine</Nav.Link>
          <Button bg="dark" variant="dark" className="logoutButton" onClick={handleLogout}>
            <ArrowRightCircle style={{width: 30, height: 30}}   />
          </Button>
        </Nav>
      </Navbar>
      <br />
      <h3 style={{textAlign: 'center', marginTop: 30, marginBottom: 20}}>BLOCK DETAIL</h3>
      <Row style={{postition: "absolute", marginLeft: "10%", width: "90%"}}>
        <Col xs lg="2" style={{fontWeight: "bold"}}>Timestamp</Col>
        <Col>{dateTimeReviver(block["timestamp"])}</Col>        
      </Row>
      <br></br>
      <Row style={{postition: "absolute", marginLeft: "10%", width: "90%"}}>
        <Col xs lg="2" style={{fontWeight: "bold"}}>Previous hash</Col>
        <Col>{block["previousHash"]}</Col>        
      </Row>
      <br></br>
      <Row style={{postition: "absolute", marginLeft: "10%", width: "90%"}}>
        <Col xs lg="2" style={{fontWeight: "bold"}}>Nonce</Col>
        <Col>{block["nonce"]}</Col>        
      </Row>
      <br></br>
      <Row style={{postition: "absolute", marginLeft: "10%", width: "90%"}}>
        <Col xs lg="2" style={{fontWeight: "bold"}}>Hash</Col>
        <Col>{block["hash"]}</Col>        
      </Row>
      <br></br>
      <footer className="footer" style={{position: "relative", top: 280, paddingBottom: 20, textAlign: "center"}}>
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