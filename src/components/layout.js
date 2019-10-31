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
    }
    this.onLoadStateChange = this.onLoadStateChange.bind(this);
  }
  onLoadStateChange(width) {
    this.setState({ width })
  }
  componentDidMount () {
    // logic to fetch the access codes from redirected url
    let accessCodeIndex = window.location.href.indexOf("code=");
    let accessCode, accessRandomKey;
    if(accessCodeIndex > -1) {
      let queryParams = window.location.href.substring(accessCodeIndex).split("&");
      if(queryParams.length > 0) {
        accessCode = queryParams[0].replace("code=", "");
        accessRandomKey = queryParams[1].replace("state=", "");
      }
    }

    // get accesstoken only if github access code is available
    if (accessCode) {
      fetch(
        'https://9107d8n8y2.execute-api.us-east-1.amazonaws.com/dev/auth/accessToken/generate', 
        {
          method: "POST",
          body: JSON.stringify({
            "code": accessCode,
            "state": accessRandomKey,
          })
        }
      )
      .then(function (response) {
        return response.json();
      })
      .then(function(data){
        let secretAccessTokenData = JSON.parse(data);
        console.log(secretAccessTokenData);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
  render() {
    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        onLoadStateChange: this.onLoadStateChange,
      })
    })
    let { width } = this.state
    //reset the progress once 100%
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
            <Header siteTitle={data.site.siteMetadata.title} />
            <div
              className="progress-bar"
              style={{ width, transition: width === '0%' ? 'none' : '1s' }}
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
