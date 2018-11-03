import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import FileUploader from '../components/fileUploader';

const IndexPage = () => (
  <Layout>
    <Link to="/page-2/">Go to page 2</Link>
    <FileUploader />
  </Layout>
)

export default IndexPage
