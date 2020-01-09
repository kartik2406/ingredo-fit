import React from "react"
import { Link } from "gatsby"

import "./header.scss"

const Header = ({ siteTitle, userData, userLogin }) => { 
  return (
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
              userData.avatar_url ? <button className="login-button"><img className="avatar-image" src={userData.avatar_url} alt="users avatar"/></button> : <Link className="login-button" to="/login">Login</Link>
            }
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Header