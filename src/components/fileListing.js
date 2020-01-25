import React, { useState } from "react"
import axios from 'axios'

import "./fileListing.scss"

const deleteFile = async event => {
	event.preventDefault()

	let fileName = event.currentTarget.dataset.filename
	let jwt = event.currentTarget.dataset.jwt

	let deleteFileStatus = await axios.delete(
		process.env.GATSBY_URL_DELETE_FILE,
		{
			params: {
				fileName,
				jwt,
			},
			withCredentials: true,
		}
	)
	if(deleteFileStatus.error) {
		console.log(deleteFileStatus.error)
	}
	else {
		console.log(deleteFileStatus.status)
	}
}

export default function fileListing(props) {
	return (
		<ul>
			{
				props.userData ?
					props.userData.filesList ?
						props.userData.filesList.map(
							(file, index) => <li key={index}>{file.name} <button data-filename={file.name} data-fileurl={file.url} data-jwt={props.jwt} onClick={deleteFile}>x</button></li>
						)
						: ""
					: ""
			}
		</ul>
	)
}