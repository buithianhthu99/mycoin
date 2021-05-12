import React, {useEffect, useCallback} from 'react'
import { BrowserRouter, Redirect, Route, Switch, useHistory } from 'react-router-dom'
import CreateWallet from './screens/CreateWallet/index'
import ShowStatistics from './screens/ShowStatistics/index'
import SendCoin from './screens/SendCoin/index'
import Dashboard from './screens/Dashboard/index'
import Homepage from './screens/HomePage/index'
import ConnectWallet from './screens/ConnectWallet/index'
import {SocketContext, socket} from './context/socket.js';

export default function App() {
  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Switch>
          <Route exact path= "/statistics">
            <ShowStatistics/>
          </Route>
          <Route exact path= "/send">
            <SendCoin/>
          </Route>
          <Route exact path= "/dashboard">
            <Dashboard/>
          </Route>
          <Route exact path= "/connect">
            <ConnectWallet/>
          </Route>
          <Route exact path= "/create">
            <CreateWallet/>
          </Route>
          <Route exact path= "/">
            <Homepage/>
          </Route>
        </Switch>
      </BrowserRouter>
    </SocketContext.Provider>
  )
}