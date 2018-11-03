import React, { Component } from 'react'
import { storage } from '../utils/firebase'

export default class FileUploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      progress: 0,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    const file = this.fileInput.files[0]
    let uploadTask = storage
      .ref()
      .child(file.name)
      .put(file)

    uploadTask.on(
      'state_changed',
      snapshot => {
        // Handle progress of upload
        let progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        this.setState({ progress })
      },
      error => {
        // Handle unsuccessful upload
      },
      () => {
        // Handle successful upload
        this.setState({
          progress: 100,
        })
        uploadTask.snapshot.ref
          .getDownloadURL()
          .then(downloadURL =>
            console.log(
              `Your uploaded image is now available at ${downloadURL}`
            )
          )
      }
    )
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input
            type="file"
            accept="image/*"
            multiple={false}
            ref={input => {
              this.fileInput = input
            }}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    )
  }
}
