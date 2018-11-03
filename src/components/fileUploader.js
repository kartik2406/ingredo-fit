import React, { Component } from 'react'
import { storage } from '../utils/firebase'
import Clarifai from 'clarifai'

//TODO: seperate clarifai logic into utils

export default class FileUploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      progress: 0,
      uploadedImage: null,
      concepts: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setImage = this.setImage.bind(this)
    this.app = new Clarifai.App({
      apiKey: 'a62c9413669344ca8c4968130516a84b',
    })
    this.concepts = []
    this.uploadedImage = ''
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
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          console.log(`Your uploaded image is now available at ${downloadURL}`)
          this.setState({
            uploadedImage: downloadURL,
          })
          this.setImage(downloadURL)
        })
      }
    )
  }

  setImage(url) {
    this.app.models.predict('bd367be194cf45149e75f01d59f77ba7', url).then(
      response => {
        console.log(response)
        // do something with response
        let concepts = response['outputs'][0]['data']['concepts']
        // console.log(concepts)
        this.setState({
          concepts,
        })

        console.log('concepts', this.state.concepts)
      },
      err => {
        // there was an error
      }
    )
  }

  render() {
    let {uploadedImage, concepts} = this.state;
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
        <img src={uploadedImage} alt="" />
        <ul>{concepts.map( (concept, index) => {
          return <li key={index}>Name: {concept.name} Value: {concept.value}</li>
        })}</ul>
      </form>
    )
  }
}
