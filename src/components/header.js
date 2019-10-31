import React from 'react'
import { Link } from 'gatsby'

import './header.scss'

const Header = ({ siteTitle, userData }) => (
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
          {
            userData.avatar_url ? <a className="login-button" href={"#"}><img className="avatar-image" src={userData.avatar_url} alt="users avatar"/></a> : <a className="login-button" href={"https://github.com/login/oauth/authorize?client_id=Iv1.c6778b1c26a766bd&state=randomstring" + Math.floor(Math.random() * 90 + 10)}>Login</a>
          }
        </li>
      </ul>
    </div>
  </div>
)

export default Header
