import React, { useState } from "react"
import axios from 'axios'

import "./fileListing.scss"

const deleteFile = async event => {
	event.preventDefault()

	let fileName = event.currentTarget.dataset.filename
	let jwt = event.currentTarget.dataset.jwt

	// let deleteFileStatus = await 
	
	// axios.delete(
	// 	process.env.GATSBY_URL_DELETE_FILE, 
	// 	{
	// 		withCredentials: true,
	// 		data: {
	// 			foo: "bar"
	// 		},
	// 	},
	// )
	// .then(res => {
	// 	return res.text()
	// })
	// .catch(error => {
	// 	// handle error from aws lambda
	// 	console.log(error)
	// })

	// if(deleteFileStatus.error) {
	// 	console.log(deleteFileStatus.error)
	// }
	// else {
	// 	console.log(deleteFileStatus.status)
	// }

	var data = {};
	data.firstname = "John2";
	data.lastname  = "Snow2";
	var json = JSON.stringify(data);

	// Delete a user
	var url = process.env.GATSBY_URL_DELETE_FILE;
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	xhr.open("DELETE", url, true);
	xhr.onload = function () {
		if (xhr.readyState == 4 && xhr.status == "200")
			console.log(xhr.responseText);
	}
	xhr.send(json);

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