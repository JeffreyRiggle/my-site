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
        background_color: `#FFF`,
        theme_color: `#FFF`,
        display: `minimal-ui`
      },
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "Github",
        fieldName: "github",
        url: 'https://api.github.com/graphql',
        headers: {
          Authorization: `Bearer ${fs.readFileSync('token', 'utf8')}`
        },
        fetchOptions: {}
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: true,
              prompt: {
                user: "root",
                host: "localhost",
                global: false,
              },
              escapeEntities: {}
            }
          }
        ]
      }
    }
  ],
}
