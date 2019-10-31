import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import { auth } from '../utils/firebase';

import Header from './header'
import './layout.scss'

class Layout extends React.Component {
  constructor() {
    super()
    this.state = {
      width: '0%',
      userData: {},
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
      .then(awsLambdaGithubAccessTokenGeneratorRes => {
        return awsLambdaGithubAccessTokenGeneratorRes.json();
      })
      .then(awsLambdaGithubAccessTokenGeneratorTransformedRes => {
        // handle error from aws lambda githubAccessTokenGenerator
        if(awsLambdaGithubAccessTokenGeneratorTransformedRes.getGithubAccessTokenResponse && awsLambdaGithubAccessTokenGeneratorTransformedRes.getGithubAccessTokenResponse.body) {
          // check for error body
          let getGithubAccessTokenResponseBody = JSON.parse(awsLambdaGithubAccessTokenGeneratorTransformedRes.getGithubAccessTokenResponse.body);
          if(getGithubAccessTokenResponseBody.error) {
            console.log(getGithubAccessTokenResponseBody);
          }
          else{
            // handle the error
            console.log(awsLambdaGithubAccessTokenGeneratorTransformedRes);
          }
        }
        else {
          let secretAccessToken = awsLambdaGithubAccessTokenGeneratorTransformedRes.access_token;
          let userData = awsLambdaGithubAccessTokenGeneratorTransformedRes.userData;
          let firebaseCredentials = auth.GithubAuthProvider.credential(secretAccessToken);

          // exchange the OAuth 2.0 access token for a Firebase credential 
          auth()
            .signInWithCredential(firebaseCredentials)
            .then(firebaseAuthData => {
              if(firebaseAuthData.additionalUserInfo && firebaseAuthData.additionalUserInfo.profile) {
                this.setState({
                  userData: firebaseAuthData.additionalUserInfo.profile,
                });
              }
              else {
                console.log(firebaseAuthData);
              }
            })
            .catch(firebaseAuthError => {
              // Handle Errors here.
              var errorCode = firebaseAuthError.code;
              var errorMessage = firebaseAuthError.message;
              // The email of the user's account used.
              var email = firebaseAuthError.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = firebaseAuthError.credential;
            });
        }
      })
      .catch(function (error) {
        // handle error from aws lambda
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
            <Header siteTitle={data.site.siteMetadata.title} userData={this.state.userData}/>
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
