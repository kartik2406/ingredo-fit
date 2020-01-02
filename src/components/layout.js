import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import './layout.scss'

class Layout extends React.Component {
  constructor() {
    super()
    this.state = {
      width: '0%',
      userData: {},
    }
    this.onLoadStateChange = this.onLoadStateChange.bind(this);
    this.userLogin = this.userLogin.bind(this);
  }
  onLoadStateChange(width) {
    this.setState({width})
  }
  componentDidMount () {
    // if window.accessCode is false, that means either this is a 
    // child window with href containing a code
    // or parent window of the mobile device
    if(!window.accessCode) {
      // logic to fetch the access codes from redirected url
      let accessCodeIndex = window.location.href.indexOf("code=")
      let accessCode, accessRandomKey
      if(accessCodeIndex > -1) {
        let queryParams = window.location.href.substring(accessCodeIndex).split("&")
        if(queryParams.length > 0) {
          accessCode = queryParams[0].replace("code=", "")
          accessRandomKey = queryParams[1].replace("state=", "")

          // if the client device is desktop
          if(window.opener) {
            window.opener.accessCode = accessCode
            window.opener.accessRandomKey = accessRandomKey
            window.close()
          }
          // else its a mobile device
          else {
            window.accessCode = accessCode
            window.accessRandomKey = accessRandomKey
            this.userLogin()
          }
        }
      }
    }
    // if not login then this is a primary window
    // fetch the user data with set valid cookie
    else {
      this.checkUser()
    }
  }
  checkUser() {
    fetch(
      'https://j6kd67te30.execute-api.us-east-1.amazonaws.com/uat/user/profile',
      {
        method: "GET",
        credentials: 'include',
      }
    )
    .then(res => {
      if(res.status === 200)
        return res.json()
      else
        return res.text()
    })
    .then(res => {
      // handle error from aws lambda githubAccessExchange
      if(res.login) {
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
  userLogin() {
    fetch(
      'https://j6kd67te30.execute-api.us-east-1.amazonaws.com/uat/user/login',
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
      if(res.status === 200)
        return res.json()
      else
        return res.text()
    })
    .then(res => {
      // handle error from aws lambda githubAccessExchange
      if(res.login) {
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
  render() {
    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        onLoadStateChange: this.onLoadStateChange,
      })
    })
    let { width } = this.state
    // reset the progress once 100%
    if (width === '100%') {
      setTimeout(() => this.setState({ width: '0%' }), 1000)
    }
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
          <>
            <Helmet
              title={data.site.siteMetadata.title}
              meta={[
                { name: 'description', content: 'Sample' },
                { name: 'keywords', content: 'sample, something' },
              ]}
            >
              <html lang="en" />
            </Helmet>
            <Header siteTitle={data.site.siteMetadata.title} userData={this.state.userData} userLogin={this.userLogin}/>
            <div
              className="progress-bar"
              style={{width, transition: width === '0%' ? 'none' : '1s'}}
            />
            <div
              style={{
                margin: '0 auto',
              }}
            >
              {children}
            </div>
          </>
        )}
      />
    )
  }
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
