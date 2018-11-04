import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import './layout.css'

class Layout extends React.Component {
  constructor() {
    super()
    this.state = {
      width: '0%',
    }
    this.onLoadStateChange = this.onLoadStateChange.bind(this)
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
    if (width == '100%') {
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
              style={{ width, transition: width == '0%' ? 'none' : '1s' }}
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
