import React, { Component } from 'react'
import { storage } from '../utils/firebase'
import { getIngredients } from '../utils/clarifai'
import { FOOD_DATA } from '../utils/data'
import './fileUploader.css'
//TODO: seperate clarifai logic into utils

export default class FileUploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      progress: 0,
      uploadedImage: null,
      ingredients: [],
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
    getIngredients(url).then(
      response => {
        console.log(response)
        // do something with response
        let concepts = response['outputs'][0]['data']['concepts']

        let ingredients = concepts.map(concept => {
          let ingredient = FOOD_DATA.find(food => food.name == concept.name)
          return {
            ...concept,
            ...ingredient,
          }
        })
        // console.log(concepts)
        this.setState({
          ingredients,
        })

        console.log('concepts', this.state.ingredients)
      },
      err => {
        // there was an error
      }
    )
  }

  render() {
    let { uploadedImage, ingredients } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
      <ul className="upload-image">
        <li>
          <input
            type="file"
            accept="image/*"
            multiple={false}
            ref={input => {
              this.fileInput = input
            }}
          />
        </li>
        <li><button className="btn btn-primary" type="submit">Submit</button></li>
      </ul>
        <img src={uploadedImage} alt="" />
        <ul>
          {ingredients.map((ingredient, index) => {
            return (
              <li key={index}>
                Name: {ingredient.name} Calories: {ingredient.calories} Protein:{' '}
                {ingredient.protein} Vitamin C: {ingredient.c}
              </li>
            )
          })}
        </ul>
      </form>
    )
  }
}
