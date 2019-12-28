import React, { Component } from 'react'
import Clarifai from 'clarifai'
import classNames from 'classnames'
import { FOOD_DATA } from '../utils/data'
import './fileUploader.scss'
import Food from '../assets/icons/food.svg'
import Calorie from '../assets/icons/calorie.svg'
import Protein from '../assets/icons/protein.svg'
import C from '../assets/icons/c.svg'

import axios from 'axios'

// TODO: seperate clarifai logic into utils

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

    let signedUrlfromGcp = "https://storage.googleapis.com/ingredofit.appspot.com/26397695/c69fe7b0-24aa-11ea-8000-01_26397695.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=ingredo-fit-db-account%40ingredofit.iam.gserviceaccount.com%2F20191222%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20191222T110416Z&X-Goog-Expires=28793&X-Goog-SignedHeaders=content-type%3Bhost&X-Goog-Signature=52a3cd75cf2e8b3bf1175c5279d734b71efc5f2e1837bfec1ed61e74f8844e1ede90778084bfd4a31288198ca09cc54c747219b50152009bcbb939d7d545be048762bd1b9c6db1d60bf8671b715815439848ed9d9a24b28530998510d24b74c7413dc462436432ab000046f88349470f3cc3321fea27a5d43a01596f77e927239f764e97b89a6a8b4327aad6220222ad149d59977b5db8b5706c3b4474fab41061a87dfde914628029e4ca7f88b3b960dbfd750df07e8e81a8273d1d053c56d192931b8ffe2dd213d0bc017781d0c7484db084bac9315ea0428b12669e5dac05dbda43ecd2827fa4f85c0732b821adb5b7291fcff2ca67913ca828348a79e92e";

    axios.put(signedUrlfromGcp, file, {
        headers: {
          'Content-Type': file.type,
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
