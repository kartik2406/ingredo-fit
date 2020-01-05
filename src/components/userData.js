import React from "react"
import PropTypes from "prop-types"

class UserData extends React.Component {
	constructor(props) {
		super()
		this.onLoadStateChange = this.onLoadStateChange.bind(this);
	}
	onLoadStateChange(width) {
		this.setState({ width })
	}
	render() {
		const children = React.Children.map(this.props.children, child => {
			return React.cloneElement(child, {
				onLoadStateChange: this.onLoadStateChange,
			})
		})
		let { width } = this.state
		// reset the progress once 100%
		if (width === '100%') {
			setTimeout(() => this.setState({ width: '0%' }), 1000)
		}
		return (
			<>
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
		)
	}
}
UserData.propTypes = {
	children: PropTypes.node.isRequired,
}

export default UserData