import React, {useEffect} from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import CreateWallet from './component/CreateWallet/index'
import ShowStatistics from './component/ShowStatistics/index'
import SendCoin from './component/SendCoin/index'
import ShowHistory from './component/ShowHistory/index'


export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path= "/statistics" component={ShowStatistics} />
        <Route exact path= "/send" component={SendCoin} />
        <Route exact path= "/history" component={ShowHistory} />
        <Route path="/" component={CreateWallet} />
      </Switch>
    </BrowserRouter>
  )
}