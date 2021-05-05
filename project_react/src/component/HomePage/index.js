import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Navbar, Row, Col, Card, Button } from 'react-bootstrap';

export default function ShowStatistics() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand style={{fontSize: 28, paddingLeft: 30}}>My coin</Navbar.Brand>
      </Navbar>
      <br />
      <Row>
        <Col style={{left: "20%"}}>
          <Card className="card_item">
            <Card.Img variant="top" src="https://i.pinimg.com/originals/f6/b0/9e/f6b09e1dbbfe0e6e3e15c40499d1d437.png" />
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
            <Card.Img variant="top" src="https://cdn.dribbble.com/users/2912503/screenshots/7153341/wallet.jpg" />
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
    </>
  );
}