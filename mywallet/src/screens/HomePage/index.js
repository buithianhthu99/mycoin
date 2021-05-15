import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Navbar, Row, Col, Card, Button } from 'react-bootstrap';
import createWallet from '../../img/createWallet.png';
import accessWallet from '../../img/accessWallet.png';

export default function ShowStatistics() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand style={{fontSize: 28, paddingLeft: 30}}>My coin</Navbar.Brand>
      </Navbar>
      <br />
      <div>
        <Row style={{width: "80%"}}>
          <Col style={{marginLeft: "12%"}}>
            <Card className="card_item">
              <Card.Img variant="top" src={createWallet} />
              <Card.Body>
                <Card.Title>Create wallet</Card.Title>
                <Card.Text>
                  Generate your own unique wallet now
                </Card.Text>
                <Button variant="primary" className="button" href="/create">Get Started</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col >
            <Card className="card_item">
              <Card.Img variant="top" src={accessWallet} />
              <Card.Body>
                <Card.Title>Access My Wallet</Card.Title>
                <Card.Text>
                  Connect to the blockchain using the created wallet
                </Card.Text>
                <Button variant="primary" className="button" href="/connect">Access now</Button>
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