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

    let signedUrlfromGcp = "https://storage.googleapis.com/ingredofit.appspot.com/IMG-20161021-WA0017.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=ingredo-fit-db-account%40ingredofit.iam.gserviceaccount.com%2F20191201%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20191201T111638Z&X-Goog-Expires=28801&X-Goog-SignedHeaders=host&X-Goog-Signature=79c0f8739b2345ccb5cedf59a32748c749dc2888d41d994722fe4a4344655b275a95e8f1a849386922aa03c137d900ddcd5bc42c9fe758f3e4f1ad71fcefe91eff230de82c0364a2f6715b7377f7a6e3a5944b359f4312492d22725c7a6a4d236dd2dfd56493d89569317ded1c616a4d89ca2d6602f879454e773cad8a2ab7b3bef4a42ba25481b2a33f630128cd2b067e63cc957842aafcaff861b83b29d932c4cde4f8497919df2a16349aa37ea5e77e6c7cebbd6b4c934497f64fd5bee0f5c9288c009014aecb974fc0d8b0bb242be3d4949e3e06c4e3d237c715eef0088df83f6f71d537b1de2e7b0adbf9928dd386cac05790ba2db16570de0d9bd541b7";

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
