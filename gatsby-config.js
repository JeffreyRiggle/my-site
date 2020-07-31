const fs = require('fs');

module.exports = {
  siteMetadata: {
    title: `ilusr`,
    description: `Personal Website`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/content/blog`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`
      },
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "Github",
        fieldName: "github",
        url: 'https://api.github.com/graphql',
        fetchOptions: {}
      }
    },
    `gatsby-transformer-remark`
  ],
}
