import React, { useState } from "react"
import axios from 'axios'

import "./fileListing.scss"

const deleteFile = async event => {
	event.preventDefault()
	let fileName = event.currentTarget.dataset.filename
	let deleteFileStatus = await axios.delete(
		process.env.GATSBY_URL_SIGNED_FILE_UPLOAD,
		{
			params: {
				fileName
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
							(file, index) => <li key={index}>{file} <button data-filename={file} onClick={deleteFile}>x</button></li>
						)
						: ""
					: ""
			}
		</ul>
	)
}