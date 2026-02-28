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
    `gatsby-plugin-image`,
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
        display: `minimal-ui`,
        icon: 'src/images/site-favicon.png'
      },
    },
    {
      resolve: "gatsby-source-github-api",
      options: {
        url: 'https://api.github.com/graphql',
        token: process.env.GITHUB_TOKEN,
        graphQLQuery: `
          query {
            viewer {
              name
              repositories(last: 100) {
                nodes {
                  name
                  description
                  first: object(expression: "master:README.md") {
                    id
                    ... on Blob {
                      text
                    }
                  }
                }
              }
            }
          }
        `
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
