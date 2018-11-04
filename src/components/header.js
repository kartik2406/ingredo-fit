import React from 'react'
import { Link } from 'gatsby'

import './header.css'

const Header = ({ siteTitle }) => (
  <div
  className="header"
  >
    <div
    className="header-content"
    >
      <h1 className="app-name">
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
