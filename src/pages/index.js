import React from 'react'

import Layout from '../components/layout'
import FileUploader from '../components/fileUploader'
import './index.css'

const IndexPage = ({onLoadStateChange}) => (
  <Layout>
    <FileUploader onLoadStateChange={onLoadStateChange}/>
  </Layout>
)

export default IndexPage
