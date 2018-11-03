import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import Image from '../components/image'

import Clarifai from 'clarifai'
const app = new Clarifai.App({
  apiKey: 'a62c9413669344ca8c4968130516a84b'
});
const res = {};
app.models.initModel({id: Clarifai.GENERAL_MODEL, version: "aa7f35c01e0642fda5cf400f543e7c40"})
      .then(generalModel => {
        return generalModel.predict("https://samples.clarifai.com/metro-north.jpg");
      })
      .then(response => {
        var concepts = response['outputs'][0]['data']['concepts']
        console.log(concepts);
      })

File.prototype.convertToBase64 = function(callback){

  var FR= new FileReader();
  FR.onload = function(e) {
       callback(e.target.result)
  };       
  FR.readAsDataURL(this);
}



const IndexPage = () => (
  <Layout>
    <ul>
      <li>
        
      </li>
    </ul>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
