import React from 'react'
import { Link } from 'gatsby'

import './header.scss'

const Header = ({ siteTitle }) => (
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
              {siteTitle}
            </Link>
          </h1></li>
        <li>
          <a className="login-button" href={"https://github.com/login/oauth/authorize?client_id=Iv1.c6778b1c26a766bd&redirect_uri=http://localhost:8000/&state=randomstring"}>Login</a>
        </li>
      </ul>
    </div>
  </div>
)

export default Header
