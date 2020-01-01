import React, { Component } from 'react'
import classNames from 'classnames'
import './fileUploader.scss'
import Food from '../assets/icons/food.svg'
import Calorie from '../assets/icons/calorie.svg'
import Protein from '../assets/icons/protein.svg'
import C from '../assets/icons/c.svg'

import axios from 'axios'

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
  }
  handleChange(event) {
    this.setState({
      fileSelected: true,
      fileName: event.target.files[0].name,
    })
  }
  async handleSubmit(event) {
    event.preventDefault()

    let { onLoadStateChange } = this.props
    onLoadStateChange('25%') // start the loader
    const file = this.fileInput.files[0]
    const fileType = file.type
    this.setState({
      uploadedImage: null,
      ingredients: [],
    })

    // fetch the signed url for file upload
    let getSignedUrlForStorage = await axios.get(
      "https://9107d8n8y2.execute-api.us-east-1.amazonaws.com/dev/file/signedUrl",
      {
        params: {
          fileType
        },
        withCredentials: true,
      }
    )

    // handle the error for fetching the signed URL
    if(getSignedUrlForStorage.status !== 200) {
      console.log(getSignedUrlForStorage.statusText)
    }
    // PUT the file on GCP bucket
    else {
      let putFileInGcpBucket = await axios.put(getSignedUrlForStorage.data.uploadedFileData.url, file, {
        headers: {
          'Content-Type': fileType,
        },
      })

      // handle the error uploading the file to GCP Bucket
      if(putFileInGcpBucket.status !== 200) {
        console.log(putFileInGcpBucket.statusText)
      }
      // fetch the url of the uploaded file and
      // the details of the Clarifai ingredients API
      else {
        // after fetching the clarifai ingredients 
        // from the aws lambda api
        let fetchUploadedImageData = await axios(
          "https://9107d8n8y2.execute-api.us-east-1.amazonaws.com/dev/file/signedUrlAndIngredients",
          {
            params: {
              fileName: getSignedUrlForStorage.data.uploadedFileData.uploadedFileName,
            },
            withCredentials: true,
          }
        )
        if(fetchUploadedImageData.status !== 200) {
          console.log(fetchUploadedImageData.statusText)
        }
        else {
          this.setDataOfSelectedImage(fetchUploadedImageData.data.url, fetchUploadedImageData.data.ingredients)
        }
      }
    }
  }
  handleSelect() {
    this.fileInput.click()
  }
  setDataOfSelectedImage(url, ingredients) {
    let { onLoadStateChange } = this.props

    onLoadStateChange('100%')
    this.setState({
      uploadedImage: url,
      ingredients: ingredients
    })
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
