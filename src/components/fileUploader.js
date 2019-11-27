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

import axios from 'axios'

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
    event.preventDefault()

    let { onLoadStateChange } = this.props
    onLoadStateChange('25%') //start the loader
    const file = this.fileInput.files[0]
    this.setState({
      uploadedImage: null,
      ingredients: [],
    })

    let signedUrlfromGcp = "https://storage.googleapis.com/ingredofit.appspot.com/IMG-20161021-WA0017.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=ingredo-fit-db-account%40ingredofit.iam.gserviceaccount.com%2F20191127%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20191127T163502Z&X-Goog-Expires=28800&X-Goog-SignedHeaders=host&X-Goog-Signature=276dac5e4aae751bf988c1f2478981da47417a713f1502f6592823cae9c1fa126e25f2bac63bc1e910357ce598191d957a0a8564b62f087b8f52513a89dbabeb2e9a69734cff26aeb9b49847095c6ec1d220f8606613fc1fb22a77bc19b7c75d933e5243b7fa4f8c513c82a4ecd2784541831a0fb65c8b89dbb5ebd870fafda628aafd24f48d2073cacfbed83c8c8772ba325dbd0f0d94f871241eb14f45fd183f27726104fe8f0eda139d4c09935c79c9bdadd234068f604ed413cc327c3952e70c218ab4f0b2c0a0b65252a0ae94f321b4f643ec340eb474fe496af8648d57d668a3a0f984c8bdcfa3d1b6ab63d099b76a28a08034c54483b78412d0a0db61";

    axios.put(signedUrlfromGcp, file, {
        headers: {
          'Content-Type': file.type
        }
    })
    .then(res =>{
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    });
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
