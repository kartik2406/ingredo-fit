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
    fetch(
      "https://omrim2xn1h.execute-api.us-east-2.amazonaws.com/default/ingredoFit-authentication-server", 
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({
            "code": "90a159e5cb1d3ee5b58a",
            "state": "randomstring",
        }) // body data type must match "Content-Type" header
      }
    )
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  onLoadStateChange(width) {
    this.setState({ width })
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
