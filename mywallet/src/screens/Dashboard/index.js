import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Navbar, Nav, Button, Card, Row, Col } from 'react-bootstrap';
import { SocketContext } from '../../context/socket.js';
import addressIcon from '../../img/addressIcon.png';
import balanceIcon from '../../img/balanceIcon.png';
import { ArrowRightCircle } from 'react-bootstrap-icons'

export default function Dashboard() {
  const socket = useContext(SocketContext);
  const history = useHistory();
  const [amount, setAmount] = useState();
  const [loaded, setLoaded] = useState(false);
  const [listTransactions, setListTransactions] = useState([]);

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
      socket.emit("get_my_transactions", localStorage.getItem("address"))
      socket.on("transactions", (data) => {
      console.log("Transactions: ", JSON.stringify(data["result"]))
      setListTransactions(data["result"].reverse());
    }) 
    }
  })

  const dateTimeReviver = (value) => {
    var d = new Date(value);
    var formattedDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
    var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
    var formattedTime = hours + ":" + minutes;

    formattedDate = formattedDate + " " + formattedTime;
    return formattedDate;
  }

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
      <div>
        <Row style={{width: "80%", height: 500}}>
          <Col style={{marginLeft: "12%"}}>
            <Card className="card_item" style={{height: 320}}>
              <Card.Img variant="top" src={addressIcon} style={{width: 150, height: 150, objectFit: "cover", marginTop: 30, marginLeft: 120}} />
              <Card.Body>
                <Card.Title>Address</Card.Title>
                <Card.Text style={{fontSize: 15, fontStyle: "italic"}}>
                  {localStorage.getItem("address")}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col >
            <Card className="card_item" style={{height: 320}}>
              <Card.Img variant="top" src={balanceIcon} style={{width: 150, height: 150, objectFit: "cover", marginTop: 30, marginLeft: 120}} />
              <Card.Body>
                <Card.Title>Balance</Card.Title>
                <Card.Text style={{fontSize: 28, color: "#ff0000", fontStyle: "italic"}}>
                  {amount} VNĐ
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row style={{width: "80%", position: "absolute", marginLeft: "10%"}}>
          <Col>
            <Row>
              <h3 style={{ marginBottom: 25}}>My transactions</h3>
            </Row>
            <Row>
              <Col xs lg="1" style={{fontWeight: "bold"}}>#</Col>
              <Col style={{fontWeight: "bold"}}>Timestamp</Col>
              <Col style={{fontWeight: "bold"}}>From</Col>
              <Col style={{fontWeight: "bold"}}>To</Col>
              <Col style={{fontWeight: "bold"}}>Amount</Col>
            </Row>
            {
              listTransactions.map((item) => (
                <Link to={`/mytransaction/${lenTransactions}`}>
                  <Row key={lenTransactions--}>
                    <Col xs lg="1">{lenTransactions}</Col>
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
      </div>
      <br></br>
      
      <br></br>
      <footer className="footer" style={{position: "relative", top: 200, paddingBottom: 20, textAlign: "center"}}>
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