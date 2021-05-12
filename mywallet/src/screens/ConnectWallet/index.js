import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Navbar, Card, Button, Form, Alert } from 'react-bootstrap';
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

export default function ConnectWallet() {
  const [privateKey, setPrivateKey] = useState();
  const [alert, setAlert] = useState("A private key is a 256-bit number in hexadecimal");
  const history = useHistory();

  const handleClick = async () => {
    if (checkValidPrivate()) {
      const myKey = ec.keyFromPrivate(privateKey);
      const myWalletAddress = myKey.getPublic('hex');
      await localStorage.setItem("privateKey", privateKey);
      await localStorage.setItem("address", myWalletAddress);
      history.push("/dashboard");
    }
    else {      
      setAlert("Private key not valid")
    }
  }

  const checkValidPrivate = () => {
    var re = /[0-9A-Fa-f]{6}/g;
    if (re.test(privateKey) && privateKey.length===64) {
      return true;
    }
    return false;
  } 

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand style={{fontSize: 28, paddingLeft: 30}}>My coin</Navbar.Brand>
      </Navbar>
      <br />
      <Card className="card_item" style={{width: 650, height: 500}}>
        <Card.Img className="card_image" variant="top" src="https://cdn.dribbble.com/users/2912503/screenshots/7153341/wallet.jpg" style={{width: 400, height: 300}} />
        <Card.Body>
          <Card.Title>Private key</Card.Title>
          <Card.Text>
            <Form.Control onChange={e => setPrivateKey(e.target.value)} type="text" placeholder="Enter your private key" />
            <p></p>
            <p className="alert-text">{alert}</p>
            <Button variant="primary" className="button" onClick={handleClick}>Access now</Button>
          </Card.Text>
        </Card.Body>
      </Card>
      <br></br>
      <footer class="footer" style={{position: "relative", top: 150, paddingBottom: 20, textAlign: "center"}}>
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