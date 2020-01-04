import React from 'react'

import UserData from '../components/userData'
import FileUploader from '../components/fileUploader'
import './index.css'

const IndexPage = ({onLoadStateChange}) => (
  <UserData>
    <FileUploader onLoadStateChange={onLoadStateChange}/>
  </UserData>
)

export default IndexPage
