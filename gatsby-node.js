const path = require('path');
const marked = require('marked');
const { processDocumentation } = require('./src/docBuilder');
const { createFilePath } = require(`gatsby-source-filesystem`)

function createPageFromMd(createPage, projectPageTemplate, node, currentPage, pages, parent) {
  const p = parent !== currentPage ? `${node.name}/${currentPage}` : node.name;

  createPage({
    path: p,
    component: projectPageTemplate,
    context: {
        projectName: node.name,
        projectUrl: node.url,
        currentPage: currentPage,
        pages: pages,
        index: parent
    }
  });
}

function createGitPages(graphql, boundActionCreators) {
  const { createPage } = boundActionCreators;
  return new Promise((resolve, reject) => {
      const projectPageTemplate = path.resolve('src/templates/project-page.jsx');

      graphql(`query {
        github {
          viewer {
            name
            repositories(last: 100) {
              nodes {
                name
                id
                descriptionHTML
                url
                first: object(expression: "master:README.md") {
                  id
                  ... on Github_Blob {
                    text
                  }
                }
                second: object(expression: "master:doc/doc.json") {
                  id
                  ... on Github_Blob {
                    text
                  }
                }
              }
            }
          }
        }
      }
    `).then(result => {
          if (result.errors) {
              reject(result.errors);
          }
          
          const nodes = result.data.github.viewer.repositories.nodes;
          let p;
          for (const node of nodes) {
            let content = '';
            if (node.first && node.first.text) {
              content = marked(node.first.text);
            }
            
            if (!content) {
              console.log(`No content found for ${node.name} so no project page will be generated`);
              continue;
            }

            let pages = {};

            if (node.second && node.second.text) {
              let nodeData = JSON.parse(node.second.text);
              if (!p) {
                p = processDocumentation(pages, node.name, nodeData, graphql).then(() => {
                  pages['Github'] = content;
                  for (const page of Object.keys(pages)) {
                    createPageFromMd(createPage, projectPageTemplate, node, page, pages, nodeData.index);
                  }
                });
              } else {
                p.then(() => {
                  processDocumentation(pages, node.name, nodeData, graphql).then(() => {
                    pages['Github'] = content;
                    for (const page of Object.keys(pages)) {
                      createPageFromMd(createPage, projectPageTemplate, node, page, pages, nodeData.index);
                    }
                  });
                });
              }
            } else {
              pages['Github'] = content;
              createPageFromMd(createPage, projectPageTemplate, node, 'Github', pages, 'Github');
            }
          }

          if (p) {
            p.finally(() => {
              resolve();
            });
          } else {
            resolve();
          }
      })
  });
}

function createBlogPosts(graphql, boundActionCreators) {
  const { createPage } = boundActionCreators;
  const blogPost = path.resolve('./src/templates/blog-post.jsx');

  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    const posts = result.data.allMarkdownRemark.edges;

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next
        }
      })
    })

    return null;
  })
}

exports.createPages = ({ graphql, boundActionCreators }) => {
  return createGitPages(graphql, boundActionCreators).then(() => {
    return createBlogPosts(graphql, boundActionCreators);
  });
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: 'slug',
      node,
      value
    })
  }
}