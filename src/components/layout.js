import React from 'react'

import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import './layout.scss'

import UserData from "./userData"
import Login from '../pages/login'


const checkUser = () => {
  fetch(
    process.env.URL_USER_DATA,
    {
      method: "GET",
      credentials: 'include',
    }
  )
  .then(res => {
    if (res.status === 200)
      return res.json()
    else
      return res.text()
  })
  .then(res => {
    // handle error from aws lambda githubAccessExchange
    if (res.login) {
      this.setState({
        userData: res,
      })
    }
    else {
      console.log(res)
    }
  })
  .catch(function (error) {
    // handle error from aws lambda
    console.log(error)
  })
}
const userLogin = () => {
  fetch(
    process.env.URL_USER_LOGIN,
    {
      method: "POST",
      body: JSON.stringify({
        "code": window.accessCode,
        "state": window.accessRandomKey,
      }),
      credentials: 'include',
    }
  )
  .then(res => {
    if (res.status === 200)
      return res.json()
    else
      return res.text()
  })
  .then(res => {
    // handle error from aws lambda githubAccessExchange
    if (res.login) {
      this.setState({
        userData: res,
      })
    }
    else {
      console.log(res)
    }
  })
  .catch(function (error) {
    // handle error from aws lambda
    console.log(error)
  })
}

const layoutContext = React.createContext(userLogin)

class Layout extends React.Component {
  constructor() {
    super()
  }
  render() {
    return (
      <layoutContext.Provider>
        <Router>
          <Switch>
            <Route path="/">
              <UserData />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
          </Switch>
        </Router>
      </layoutContext.Provider>
    )
  }
}

export default Layout