import React, { Component } from 'react'
import { storage } from '../utils/firebase'
import Clarifai from 'clarifai'
import classNames from 'classnames'
import { FOOD_DATA } from '../utils/data'
import './fileUploader.scss'
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
      fileSelected: false,
      fileName: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.app = new Clarifai.App({
      apiKey: process.env.CLARIFAI_API_KEY,
    })
  }
  handleChange(event) {
    this.setState({
      fileSelected: true,
      fileName: event.target.files[0].name,
    })
  }
  handleSubmit(event) {
    let { onLoadStateChange } = this.props
    onLoadStateChange('25%') //start the loader
    event.preventDefault()
    const file = this.fileInput.files[0]
    this.setState({
      uploadedImage: null,
      ingredients: [],
    })
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
  handleSelect() {
    this.fileInput.click()
  }
  setImage(url) {
    let { onLoadStateChange } = this.props

    this.app.models.predict('bd367be194cf45149e75f01d59f77ba7', url).then(
      response => {
        console.log(response)
        // do something with response
        let concepts = response['outputs'][0]['data']['concepts']

        let ingredients = concepts.map(concept => {
          let ingredient = FOOD_DATA.find(food => food.name === concept.name)
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
    let { uploadedImage, ingredients, fileSelected, fileName } = this.state
    const submitBtnClasses = classNames('btn', 'btn-primary', {
      'btn-dsabled': !fileSelected,
    })
    const uploadDivClasses = classNames('upload', {
      'centerly': !uploadedImage,
    })
    return (
      <form onSubmit={this.handleSubmit}>
        <div className={uploadDivClasses} >
          {uploadedImage ? (
            <div className="uploadedDetails">
              <div className="meal">
                <div>
                  <img src={uploadedImage} alt="" />
                </div>
              </div>
              <div className="ingredients">
                <div className="table-header">
                  <table>
                    <thead>
                      <tr>
                        <th>Ingredient Name</th>
                        <th>Calories</th>
                        <th>Protein</th>
                        <th>Vitamin C</th>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div className="table-body">
                  <table>
                    <tbody>
                      {ingredients.map((ingredient, index) => {
                        return (
                          <tr className="ingredient" key={index}>
                            <td className="icon">
                              <Food
                                style={{
                                  fill: '#ff6151',
                                  height: '24px',
                                  width: '24px',
                                }}
                              />
                              <span className="value"> {ingredient.name}</span>
                            </td>
                            <td className="icon">
                              <Calorie
                                style={{
                                  fill: '#ff6151',
                                  height: '24px',
                                  width: '24px',
                                }}
                              />
                              <span className="value">
                                {' '}
                                {ingredient.calories}
                              </span>
                            </td>
                            <td className="icon">
                              <Protein
                                style={{
                                  fill: '#ff6151',
                                  height: '24px',
                                  width: '24px',
                                }}
                              />
                              <span className="value">
                                {' '}
                                {ingredient.protein}
                              </span>
                            </td>
                            <td className="icon">
                              <C
                                style={{
                                  fill: '#ff6151',
                                  height: '24px',
                                  width: '24px',
                                }}
                              />
                              <span className="value"> {ingredient.c} </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
          <div className="uploadPlaceholder">
            <ul className="upload-image">
              <li>
                <input
                  className="real-image-uploader"
                  type="file"
                  accept="image/*"
                  multiple={false}
                  ref={input => {
                    this.fileInput = input
                  }}
                  onChange={event => this.handleChange(event)}
                  required
                />
                <input
                  className="fake-image-text"
                  type="text"
                  value={fileName}
                  onChange={() => {}}
                />
              </li>
              <li>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    this.handleSelect()
                  }}
                >
                  Select
                </button>
              </li>
            </ul>
            <div className="submitButtonContainer">
              <button className={submitBtnClasses} type="submit">
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="aboutApp">
          <h4>About App</h4>
          <p>
            This app will help you keep track of what food items you are consuming, 
            give you their calorie, nutritional value. Just upload a pic of your meal,
            and let the app do its magic. It will give you a list of ingredients in your meal, 
            calories and nutrients of each item. This way you know what you are consuming.
          </p>
        </div>
      </form>
    )
  }
}
