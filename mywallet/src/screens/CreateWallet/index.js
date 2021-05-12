import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Navbar, Card, Button } from 'react-bootstrap';
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

export default function CreateWallet() {
  const [privateKey, setPrivateKey] = useState();
  const history = useHistory();

  const handleClick = async () => {
    const myKey = ec.keyFromPrivate(privateKey);
    const myWalletAddress = myKey.getPublic('hex');
    await localStorage.setItem("privateKey", privateKey);
    await localStorage.setItem("address", myWalletAddress);
    history.push("/dashboard");
  }

  useEffect(()=>{
    fetch(`http://localhost:3001/wallet/create`)
    .then(
        res => res.json())
    .then(
        (result) => {
          setPrivateKey(result.result);
        },
        (error) => {
          console.log(error)
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
        <Card.Img className="card_image" variant="top" src="https://i.pinimg.com/originals/f6/b0/9e/f6b09e1dbbfe0e6e3e15c40499d1d437.png" style={{width: 400, height: 300}} />
        <Card.Body>
          <Card.Title>Private key</Card.Title>
          <Card.Text>
            {privateKey}
            <p></p>
            <p className="alert-text">Remember this key carefully. If you forget your private key, you will lost your wallet</p>
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