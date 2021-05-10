import React from 'react';
import socketio from "socket.io-client";
const { SERVER_IP } = require("../config");

export const socket = socketio.connect(`${SERVER_IP}:8000`, {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
  }});
export const SocketContext = React.createContext();
