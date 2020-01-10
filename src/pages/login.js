import React, { Component } from "react"
import { Redirect } from "@reach/router"

class Login extends Component {
	constructor(props) {
		super()
		this.state = {
			redirect: false,
		}
	}
	componentDidMount() {
		let accessCodeIndex = window.location.href.indexOf("code=")
		let accessCode, accessRandomKey
		if (accessCodeIndex > -1) {
			let queryParams = window.location.href.substring(accessCodeIndex).split("&")
			if (queryParams.length > 0) {
				accessCode = queryParams[0].replace("code=", "")
				accessRandomKey = queryParams[1].replace("state=", "")

				// if the client device is desktop
				if (window.opener) {
					window.opener.accessCode = accessCode
					window.opener.accessRandomKey = accessRandomKey
					window.close()
				}
				// else its a mobile device
				else {
					window.accessCode = accessCode
					window.accessRandomKey = accessRandomKey

					this.setState({
						redirect: true,
					})
				}
			}
		}
		else {
			let authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GATSBY_CLIENT_ID}&scope=read:user&state=randomstring` + Math.floor(Math.random() * 90 + 10)

			if (window.innerWidth < 500) {
				window.location = authUrl
			}
			// if desktop then open oauth login service in new window
			else {
				let checkAccessCodeTimerReference;

				// check if Access Code is returned
				let checkAccessCode = () => {
					if (window.accessCode) {
						clearTimeout(checkAccessCodeTimerReference)

						this.setState({
							redirect: true,
						})
					}
					else {
						checkAccessCodeTimerReference = setTimeout(checkAccessCode, 500)
					}
				}
				window.open(authUrl, "_blank", 'location=yes,height=570,width=520,scrollbars=yes,status=yes')
				checkAccessCodeTimerReference = setTimeout(checkAccessCode, 500)
			}
		}
	}
	render() {
		return (
			<>
				{
					this.state.redirect ?
						<Redirect to="/" noThrow /> :
						"Loading..."
				}
			</>
		)
	}
}

export default Login