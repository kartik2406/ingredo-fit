import React from 'react'
import { Link } from 'gatsby'

const Header = ({ siteTitle }) => (
  <div
    style={{
      marginBottom: '1.45rem',
      background: 'white'
    }}
  >
    <div
      style={{
        margin: '0 auto',
        padding: '15px'
      }}
    >
      <h1 style={{ margin: 0, background: '-webkit-linear-gradient(#1f9389, #a5d9a1)', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent', 'font-size': '4em', padding: '0.2em 2.5em 0.4em' }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </div>
)

export default Header
