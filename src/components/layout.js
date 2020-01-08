import React from "react"
import Helmet from "react-helmet"
import { StaticQuery, graphql } from "gatsby"

import "./layout.scss"

import Header from "./header"
import UserData from "./userData"
import FileUploader from "./fileUploader"

const checkUser = (layoutThisObject) => {
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
      layoutThisObject.setState({
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
const userLogin = (layoutThisObject) => {
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
      layoutThisObject.setState({
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

const layoutContext = React.createContext()

class Layout extends React.Component {
  static contextType = layoutContext
  constructor() {
    super()
    this.state = {
			width: '0%',
			userData: {},
    }
  }
  componentDidMount() {
    if(window.accessCode) 
      userLogin(this)
    else
      checkUser(this)
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
            <Helmet
              title={data.site.siteMetadata.title}
              meta={[
                { name: 'description', content: 'Track your calorie with our app.' },
                { name: 'keywords', content: 'food, fitness' },
              ]}
            >
              <html lang="en" />
            </Helmet>
            <Header siteTitle={data.site.siteMetadata.title} userData={this.state.userData} />
            <UserData>
              <FileUploader />
            </UserData>
          </layoutContext.Provider>
        )}
      />
    )
  }
}

export default Layout