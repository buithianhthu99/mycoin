import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Navbar, Card, Button, Alert } from 'react-bootstrap';
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { SERVER_IP } = require("../../config");

export default function CreateWallet() {
  const [wallet, setWallet] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleClick = () => {
    const myKey = ec.keyFromPrivate(wallet.privateKey);
    const myWalletAddress = myKey.getPublic('hex');
    localStorage.setItem("privateKey", wallet.privateKey);
    localStorage.setItem("address", myWalletAddress);
    localStorage.setItem("amount", wallet.amount);
    history.push("/dashboard");
  }
  useEffect(()=>{
    fetch(`${SERVER_IP}:3000/wallet/create`)
    .then(
        res => res.json())
    .then(
        (result) => {
        setIsLoaded(true);
        setWallet(result.result[0]);
        },
        (error) => {
        setIsLoaded(true);
        setError(error);
        }
    )
   },[])


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
            {wallet["privateKey"]}
            <p></p>
            <p className="alert-text">Remember this key carefully. If you forget your private key, you will lost your wallet</p>
            <Button variant="primary" className="button" onClick={handleClick}>Access now</Button>
          </Card.Text>
        </Card.Body>
      </Card> 
    </>
  );
}