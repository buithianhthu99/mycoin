import React, {useEffect} from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import CreateWallet from './component/CreateWallet/index'
import ShowStatistics from './component/ShowStatistics/index'
import SendCoin from './component/SendCoin/index'
import Dashboard from './component/Dashboard/index'
import Homepage from './component/HomePage/index'
import ConnectWallet from './component/ConnectWallet/index'


export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path= "/statistics" component={ShowStatistics} />
        <Route exact path= "/send" component={SendCoin} />
        <Route exact path= "/dashboard" component={Dashboard} />
        <Route exact path= "/connect" component={ConnectWallet} />
        <Route exact path= "/create" component={CreateWallet} />
        <Route path="/" component={Homepage} />
      </Switch>
    </BrowserRouter>
  )
}