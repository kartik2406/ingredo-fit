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
      }
    )

    // handle the error for fetching the signed URL
    if(getSignedUrlForStorage.error) {
      console.log(getSignedUrlForStorage.error)
    }
    // PUT the file on GCP bucket
    else {
      let putFileInGcpBucket = await axios.put(getSignedUrlForStorage.url, file, {
        headers: {
          'Content-Type': fileType,
        }
      })

      // handle the error uploading the file to GCP Bucket
      if(putFileInGcpBucket.error) {
        console.log(putFileInGcpBucket.error)
      }
      // fetch the url of the uploaded file and
      // the details of the Clarifai ingredients API
      else {
        // after fetching the clarifai ingredients from aws
        // lambda api
        let fetchUploadedImageData = axios(
          "https://9107d8n8y2.execute-api.us-east-1.amazonaws.com/dev/file/signedUrlAndIngredients",
          {
            params: {
              fileType: getSignedUrlForStorage.uploadedFileName,
            },
          }
        )
        if(fetchUploadedImageData.error) {
          console.log(fetchUploadedImageData.error)
        }
        else {
          // let url = "https://storage.googleapis.com/ingredofit.appspot.com/06dc3190-190b-11ea-8000-01_26397695.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=ingredo-fit-db-account%40ingredofit.iam.gserviceaccount.com%2F20191231%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20191231T142623Z&X-Goog-Expires=28790&X-Goog-SignedHeaders=host&X-Goog-Signature=087ee48f97477ff210b1ce8cd1d265f8ce61e422bd9d4be26a42e23630705da8d320f328f901e4dfcb2fa68209451fdb4278523d3b04a6618cec4e4d0d32c346e519254a435e15008f58453d3394f516483113191fca720c2be1599fcbe94acea056caea077cf802725237b5975054324f7fe639103d30e255b99a01cc4b85a04ecad0847233e9d3cf6459c478865a32650860dab9a2ece74ba7aea70e0acf2482655992778fba7210b213f6b3adba81b09ac1a0fecfac3b146f50b29497284593c99bea60c89709286d34d5b9d6e628c82eabb3c232c2b685317c8725ea7fb9a1254c0b497ca1f4fb62eaf5cf663d0f335eccb073e81e50db8fc0e582ecc91b"
          // let ingredients = JSON.parse("[{\"id\":\"ai_H2d8CVB7\",\"name\":\"salad\",\"value\":0.9533902,\"app_id\":\"main\",\"calories\":152,\"protein\":\"1g\",\"c\":\"20%\"},{\"id\":\"ai_jvVxlhLh\",\"name\":\"chicken\",\"value\":0.8489008,\"app_id\":\"main\",\"calories\":167,\"protein\":\"25g\",\"c\":\"0%\"},{\"id\":\"ai_ZHtk2LRK\",\"name\":\"potato\",\"value\":0.82409143,\"app_id\":\"main\",\"calories\":77,\"protein\":\"2g\",\"c\":\"32%\"},{\"id\":\"ai_CB8hsS3T\",\"name\":\"tomato\",\"value\":0.7331903,\"app_id\":\"main\",\"calories\":25,\"protein\":\"2g\",\"c\":\"3%\"},{\"id\":\"ai_DS1S9Rxq\",\"name\":\"shrimp\",\"value\":0.7129829,\"app_id\":\"main\",\"calories\":7,\"protein\":\"3g\",\"c\":\"0%\"},{\"id\":\"ai_jmcSl8c1\",\"name\":\"bacon\",\"value\":0.6742985,\"app_id\":\"main\",\"calories\":43,\"protein\":\"3g\",\"c\":\"0%\"},{\"id\":\"ai_99rmh2vv\",\"name\":\"gnocchi\",\"value\":0.6675864,\"app_id\":\"main\"},{\"id\":\"ai_SqL5hFw6\",\"name\":\"arugula\",\"value\":0.65581834,\"app_id\":\"main\"},{\"id\":\"ai_TRbv6FWL\",\"name\":\"pork\",\"value\":0.6301855,\"app_id\":\"main\",\"calories\":206,\"protein\":\"27g\",\"c\":\"2%\"},{\"id\":\"ai_GC6FB0cQ\",\"name\":\"sauce\",\"value\":0.61736894,\"app_id\":\"main\",\"calories\":1,\"protein\":\"1g\",\"c\":\"1%\"},{\"id\":\"ai_6s1vcbq9\",\"name\":\"garlic\",\"value\":0.60348773,\"app_id\":\"main\",\"calories\":49,\"protein\":\"1g\",\"c\":\"2%\"},{\"id\":\"ai_FnZCSVMH\",\"name\":\"cheese\",\"value\":0.55981505,\"app_id\":\"main\",\"calories\":68,\"protein\":\"4.2g\",\"c\":\"1%\"},{\"id\":\"ai_0zSBLCB6\",\"name\":\"parsley\",\"value\":0.52128166,\"app_id\":\"main\"},{\"id\":\"ai_jpQRXQ36\",\"name\":\"cauliflower\",\"value\":0.50827026,\"app_id\":\"main\"},{\"id\":\"ai_QLn2rxmZ\",\"name\":\"lettuce\",\"value\":0.49784362,\"app_id\":\"main\"},{\"id\":\"ai_gLHbKNPn\",\"name\":\"parmesan\",\"value\":0.49691647,\"app_id\":\"main\"},{\"id\":\"ai_KWmFf1fn\",\"name\":\"meat\",\"value\":0.4907009,\"app_id\":\"main\",\"calories\":122,\"protein\":\"22g\",\"c\":\"1%\"},{\"id\":\"ai_ZZXvKRxt\",\"name\":\"vinaigrette\",\"value\":0.48301566,\"app_id\":\"main\"},{\"id\":\"ai_KF7Xcz9J\",\"name\":\"onion\",\"value\":0.45297867,\"app_id\":\"main\",\"calories\":24,\"protein\":\"0.7g\",\"c\":\"7%\"},{\"id\":\"ai_t7shxTxV\",\"name\":\"corn\",\"value\":0.44870216,\"app_id\":\"main\",\"calories\":44,\"protein\":\"1.6g\",\"c\":\"0%\"}]")
          
          this.setDataOfSelectedImage(fetchUploadedImageData.uploadedFileUrl, fetchUploadedImageData.ingredients)
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
