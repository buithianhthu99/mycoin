import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Navbar, Nav, Button, Row, Col } from 'react-bootstrap';
import { SocketContext } from '../../context/socket.js';
import { ArrowRightCircle } from 'react-bootstrap-icons'

export default function ShowStatistics() {
  const socket = useContext(SocketContext);
  const history = useHistory();
  const [listBlocks, setListBlocks] = useState([]);
  const [listTransactions, setListTransactions] = useState([]);

  const handleLogout = () => {
    console.log("Click on log out")
    localStorage.clear();
    history.push("/")
    socket.emit("log_disconnect")
  };

  useEffect(()=>{
    socket.emit("get_all_blocks");
    socket.emit("get_all_transactions")
    socket.on("blocks", (data) => {
      console.log("Blocks: ", JSON.stringify(data["result"]))
      setListBlocks(data["result"].reverse());
    })
    socket.on("transactions", (data) => {
      console.log("Transactions: ", JSON.stringify(data["result"]))
      setListTransactions(data["result"].reverse());
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

  let lenBlocks = listBlocks.length;
  let lenTransactions = listTransactions.length;
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
      <Row style={{postition: "absolute", marginLeft: "10%", width: "80%"}}>
        <Col>
          <Row>
            <h3 style={{paddingLeft: 100}}>BLOCKS</h3>
          </Row>
          <Row>
            <Col style={{fontWeight: "bold"}}>#</Col>
            <Col style={{fontWeight: "bold"}}>Timestamp</Col>
            <Col></Col>
            <Col></Col>
          </Row>
          {
            listBlocks.map((item) => (
              <Link to={`/block/${lenBlocks}`}>
                <Row key={lenBlocks--}>
                  <Col>Block {lenBlocks}</Col>
                  <Col>{dateTimeReviver(item["timestamp"])}</Col>
                  <Col></Col>
                  <Col></Col>
                </Row>
              </Link>
            ))
          }
        </Col>
        <Col>
          <Row>
            <h3 style={{paddingLeft: 200}}>TRANSACTIONS</h3>
          </Row>
          <Row>
            <Col style={{fontWeight: "bold"}}>#</Col>
            <Col style={{fontWeight: "bold"}}>Timestamp</Col>
            <Col style={{fontWeight: "bold"}}>From</Col>
            <Col style={{fontWeight: "bold"}}>To</Col>
            <Col style={{fontWeight: "bold"}}>Amount</Col>
          </Row>
          {
            listTransactions.map((item) => (
              <Link to={`/transaction/${lenTransactions}`}>
                <Row key={lenTransactions--}>
                  <Col>{lenTransactions}</Col>
                  <Col>{dateTimeReviver(item["timestamp"])}</Col>
                  <Col>{item["fromAddress"] === null ? "Server" : item["fromAddress"].substring(0,10) + "..."}</Col>
                  <Col>{item["toAddress"].substring(0,10) + "..."}</Col>
                  <Col>{item["amount"]}</Col>
                </Row>
              </Link>
              
            ))
          }
        </Col>
      </Row>
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