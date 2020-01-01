import React from 'react'
import { Link } from 'gatsby'

import './header.scss'

const Header = ({ siteTitle, userData, userLogin }) => { 
  let checkAccessCodeTimerReference;
  let authenticate = event => {
    let authUrl = "https://github.com/login/oauth/authorize?client_id=Iv1.c6778b1c26a766bd&state=randomstring" + Math.floor(Math.random() * 90 + 10)
    
    if(window.innerWidth < 500) {
      window.location = authUrl
    }
    // if desktop then open oauth login service in new window
    else {
      window.open(authUrl, "_blank", 'location=yes,height=570,width=520,scrollbars=yes,status=yes')
      checkAccessCodeTimerReference = setTimeout(checkAccessCode, 500)
    }
  }

  // check if Access Code is returned
  let checkAccessCode = () => {
    if(window.accessCode) {
      clearTimeout(checkAccessCodeTimerReference)
      userLogin()
    }
    else {
      checkAccessCodeTimerReference = setTimeout(checkAccessCode, 500)
    }
  }
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
              userData.avatar_url ? <button className="login-button"><img className="avatar-image" src={userData.avatar_url} alt="users avatar"/></button> : <button className="login-button" onClick={authenticate}>Login</button>
            }
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Header