import Clarifai from 'clarifai'

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY,
})

export const getIngredients = url =>
  app.models.predict('bd367be194cf45149e75f01d59f77ba7', url)
