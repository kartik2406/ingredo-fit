import React from "react"
import { useHistory } from "react-router"

class Login extends React.Component {
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

					// need to use hooks or else this below line wont work
					let history = useHistory();
					history.push("/")
				}
			}
		}
		else {
			let authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&state=randomstring` + Math.floor(Math.random() * 90 + 10)
			authUrl = `http://localhost:8000/login?code=20b24e0eda0c287a275e&state=randomstring48`

			if (window.innerWidth < 500) {
				window.location = authUrl
			}
			// if desktop then open oauth login service in new window
			else {
				let checkAccessCodeTimerReference;

				// check if Access Code is returned
				let checkAccessCode = () => {
					if(window.accessCode) {
						clearTimeout(checkAccessCodeTimerReference)

						// need to use hooks or else this below line wont work
						let history = useHistory();
						history.push("/")
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
		return <>loading...</>
	}
}

export default Login