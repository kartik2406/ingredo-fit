import React, { Component } from 'react'
import { storage } from '../utils/firebase'
import Clarifai from 'clarifai'

export default class FileUploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      progress: 0,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.app = new Clarifai.App({
      apiKey: 'a62c9413669344ca8c4968130516a84b'
    });
    this.concepts = [];
    this.uploadedImage = "";
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
          .then(downloadURL => {
            console.log(
              `Your uploaded image is now available at ${downloadURL}`
            )
            this.uploadedImage = downloadURL;
            this.setImage(downloadURL);
          })
      }
    )
  }

  setImage(url) {
    this.app.models.predict("bd367be194cf45149e75f01d59f77ba7", url)
      .then(
        function(response) {
          console.log(response);
          // do something with response
          var concepts = response['outputs'][0]['data']['concepts']
          this.concepts = concepts.map( (object) => {
            return <li>Name: {object.name} Value: {object.value}</li>
          });
          console.log(this.concepts);
        },
        function(err) {
          // there was an error
        }
    );
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
        <img src={this.uploadedImage} alt=""/>
        <ul>
          {this.concepts}
        </ul>
      </form>
    )
  }
}
