import React from 'react'
import { Link } from 'gatsby'

const Header = ({ siteTitle }) => (
  <div
    style={{
      background: 'white'
    }}
  >
    <div
      style={{
        margin: '0 auto',
        padding: '1em'
      }}
    >
      <h1 className="header" style={{ margin: 0, background: '-webkit-linear-gradient(#1f9389, #a5d9a1)', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent', }}>
        <Link
          to="/"
          style={{
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
