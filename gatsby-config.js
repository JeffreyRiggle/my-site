module.exports = {
  siteMetadata: {
    title: `ilusr`,
    description: `A public playground where I conduct small projects, technical experiments, and write-ups across a varied set of programming interests.`,
    siteUrl: `https://ilusr.com/`
  },
  plugins: [
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark, allDevToArticle } }) => {
              const siteContent = allMarkdownRemark.edges.map(edge => {
                let content = edge.node.html;
                if (/(content\/scenes)/g.test(edge.node.fileAbsolutePath)) {
                  const sceneLocation = edge.node.fileAbsolutePath.match(/\/([^/]+)\/index\.md/)[1];
                  content = `<p>View animation <a href="https://ilusr.com/${sceneLocation}">here</a></p>` + content;
                }
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": content }],
                })
              });

              const devToPosts = allDevToArticle.nodes.map(post => ({
                title: post.title,
                description: post.description,
                date: post.published_at,
                url: post.url,
                guid: post.url,
                custom_elements: [
                  {
                    "content:encoded": `<p>${post.description}</p><p><a href="${post.url}">Read on dev.to</a></p>`,
                  }
                ],
              }))

              return [...siteContent, ...devToPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
            },
            query: `
              {
                allMarkdownRemark(sort: { frontmatter: { date: DESC }}) {
                  edges {
                    node {
                      fileAbsolutePath
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
                allDevToArticle {
                  nodes {
                    title
                    description
                    published_at
                    url
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Jeff Riggle",
          },
        ],
      },
    },
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
        name: `scenes`,
        path: `${__dirname}/content/scenes`
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
        name: `ilsur`,
        short_name: `ilusr`,
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
