import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Navbar, Nav, Button } from 'react-bootstrap';
import {SocketContext, socket} from '../../context/socket.js';
import { ArrowRightCircle     } from 'react-bootstrap-icons'

export default function ShowStatistics() {
  const socket = useContext(SocketContext);
  const history = useHistory();
  const [buttonState, setButtonState] = useState(false);
  const [showState, setShowState] = useState(false);
  const [stateContent, setStateContent] = useState("Mining...")
  const [reward, setReward] = useState();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogout = () => {
    console.log("Click on log out")
    localStorage.clear();
    history.push("/")
    socket.emit("log_disconnect")
  };

  const handleMining = () => {
    setStateContent("Mining...");
    setButtonState(true);
    setShowSuccess(false);
    setShowState(true);
    const data = {address: localStorage.getItem("address"), socket_id: socket.id}
    socket.emit("mine", data);
  }

  useEffect(()=>{
    socket.on("mine_success", (data) => {
      setStateContent("Mining successfully");
      setShowSuccess(true);
      setButtonState(false);
    })
  },[])

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
      <Button onClick={handleMining} disabled={buttonState} variant="primary" style={{fontWeight: "bold", width: 180, position: "absolute", left: 100, top: 120}}>Start mining...</Button>
      <br />
      {showState && <p style={{fontStyle: "italic", fontSize: 24, position: "absolute", left: 100, top: 200}}>{stateContent}</p>}
      {showSuccess && <p style={{fontStyle: "italic", fontWeight: "bold", fontSize: 24, position: "absolute", left: 100, top: 250, color: "#ff0000"}}>Congratualtion!! You are rewarded {reward} for mining new block!</p>}
      <footer className="footer" style={{position: "relative", top: 500, paddingBottom: 20, textAlign: "center"}}>
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