import React from "react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

import "./layout.scss"

import UserData from "./userData"
import FileUploader from "./fileUploader"
import Login from "./login"


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

function Foo() {
  return <div>foo bar</div>
}
function Foo2() {
  return <div>foo bar2</div>
}

const layoutContext = React.createContext(userLogin)

class Layout extends React.Component {
  render() {
    return (
      <layoutContext.Provider>
        <Router>
          <Link to="/foo">foo</Link>
          <Link to="/">foo2</Link>
          <Switch>
            <Route path="/">
              <Foo2 />
            </Route>
            <Route path="/foo">
              <Login />
            </Route>
          </Switch>
        </Router>
      </layoutContext.Provider>
    )
  }
}

export default Layout