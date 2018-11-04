/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
exports.onCreateWebpackConfig = ({ actions, stage }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /firebase/,
            use: ['null-loader'],
          },
        ],
      },
    })
  }
}
