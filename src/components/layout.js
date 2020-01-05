import React from "react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import Helmet from "react-helmet"
import { StaticQuery, graphql } from "gatsby"

import "./layout.scss"
import "./header.scss"

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

const layoutContext = React.createContext(userLogin)

class Layout extends React.Component {
  constructor() {
    super()
    this.state = {
			width: '0%',
			userData: {},
		}
  }
  render() {
    return (
      <StaticQuery
				query={graphql`
						query SiteTitleQuery {
							site {
								siteMetadata {
									title
								}
							}
						}
				`}
				render={data => (
          <layoutContext.Provider>
            <Router>
              <Helmet
                title={data.site.siteMetadata.title}
                meta={[
                  { name: 'description', content: 'Track your calorie with our app.' },
                  { name: 'keywords', content: 'food, fitness' },
                ]}
              >
                <html lang="en" />
              </Helmet>
              <div className="header">
                <div className="header-content">
                  <ul className="menu-items">
                    <li>
                      <h1 className="app-name">
                        <Link
                          to="/"
                          style={{
                            textDecoration: 'none',
                          }}
                        >
                          {data.site.siteMetadata.title}
                        </Link>
                      </h1></li>
                    <li>
                      {
                        this.state.userData.avatar_url ? <button className="login-button"><img className="avatar-image" src={this.state.userData.avatar_url} alt="users avatar" /></button> : <Link className="login-button" to="/login">Login</Link>
                      }
                    </li>
                  </ul>
                </div>
              </div>
              <Switch>
                <Route path="/" component={UserData}>
                  <FileUploader />
                </Route>
                <Route path="/login" component={Login} />
              </Switch>
            </Router>
          </layoutContext.Provider>
        )}
      />
    )
  }
}

export default Layout