import React, { Component } from 'react'
import { storage } from '../utils/firebase'
import Clarifai from 'clarifai'
import { FOOD_DATA } from '../utils/data'
import './fileUploader.css'
import Food from '../assets/icons/food.svg'
import Calorie from '../assets/icons/calorie.svg'
import Protein from '../assets/icons/protein.svg'
import C from '../assets/icons/c.svg'

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
    this.app = new Clarifai.App({
      apiKey: 'a62c9413669344ca8c4968130516a84b',
    })
  }

  handleSubmit(event) {
     let {onLoadStateChange} = this.props;
    onLoadStateChange('25%') //start the loader
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
          onLoadStateChange('75%') 
        })
      }
    )
  }

  setImage(url) {
    let {onLoadStateChange} = this.props;

    this.app.models.predict('bd367be194cf45149e75f01d59f77ba7', url).then(
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
        onLoadStateChange('100%')
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
          <li>
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </li>
        </ul>
        <img src={uploadedImage} alt="" />
        <ul className="ingredients">
          {ingredients.map((ingredient, index) => {
            return (
              <li className="ingredient" key={index}>
                <span className="icon">
                  <Food
                    style={{
                      fill: '#ff6151',
                      height: '24px',
                      width: '24px',
                    }}
                  />
                  <span className="value"> {ingredient.name}</span>
                </span>
                <span className="icon">
                  <Calorie
                    style={{
                      fill: '#ff6151',
                      height: '24px',
                      width: '24px',
                    }}
                  />
                  <span className="value"> {ingredient.calories}</span>
                </span>
                <span className="icon">
                  <Protein
                    style={{
                      fill: '#ff6151',
                      height: '24px',
                      width: '24px',
                    }}
                  />
                  <span className="value"> {ingredient.protein}</span>
                </span>
                <span className="icon">
                  <C
                    style={{
                      fill: '#ff6151',
                      height: '24px',
                      width: '24px',
                    }}
                  />
                  <span className="value"> {ingredient.c} </span>
                </span>
              </li>
            )
          })}
        </ul>
      </form>
    )
  }
}
