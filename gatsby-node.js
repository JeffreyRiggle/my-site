const path = require('path');
const marked = require('marked');
const { processDocumentation, processMarkdownImages } = require('./src/docBuilder');
const { createFilePath } = require(`gatsby-source-filesystem`);
const unzipper = require('unzipper');
const fs = require('fs');
const https = require('https');
const apiToken = fs.readFileSync('token', 'utf8');

function createPageFromMd(createPage, projectPageTemplate, node, currentPage, pages, parent, apiDoc) {
  const p = parent !== currentPage ? `${node.name}/${currentPage}` : node.name;

  createPage({
    path: p,
    component: projectPageTemplate,
    context: {
        projectName: node.name,
        projectUrl: node.url,
        currentPage: currentPage,
        pages: pages,
        index: parent,
        hasApi: apiDoc || false
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
              content = marked(processMarkdownImages(node.first.text, `${node.url}/raw/master`));
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
                    createPageFromMd(createPage, projectPageTemplate, node, page, pages, nodeData.index, !!nodeData.api);
                  }

                  if (nodeData.api) {
                    return createAPIDoc(graphql, node.name);
                  }
                });
              } else {
                p = p.then(() => {
                  return processDocumentation(pages, node.name, nodeData, graphql).then(() => {
                    pages['Github'] = content;
                    for (const page of Object.keys(pages)) {
                      createPageFromMd(createPage, projectPageTemplate, node, page, pages, nodeData.index, !!nodeData.api);
                    }

                    if (nodeData.api) {
                      return createAPIDoc(graphql, node.name);
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
            p.then(() => {
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

const downloadGitFile = (response, fileName, repo) => {
  return new Promise((resolve, reject) => {
    response.pipe(fs.createWriteStream(fileName)).on('finish', () => {
      console.log('Created zip file');
      fs.createReadStream(fileName).pipe(unzipper.Extract({ 
        path: `public/${repo}`
      })).promise().then(() => {
        fs.unlinkSync(fileName);
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  });
}

const createAPIDoc = (graphql, repo) => {
  // This is a bit annoying but the only way I can think to do this would be
  // to release the documentation as a release
  console.log(`Creating api doc for ${repo}`);
  return new Promise((resolve, reject) => {
    graphql(`
    query {
      github {
        viewer {
          repository(name: "${repo}") {
            releases(last: 1) {
              nodes {
                name
                description
                url
                resourcePath
                releaseAssets(first: 1, name: "apidocs.zip") {
                  nodes {
                    name
                    downloadUrl
                  }
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
        return;
      }
  
      const url = result.data.github.viewer.repository.releases.nodes[0].releaseAssets.nodes[0].downloadUrl;
      const fileName = `${repo}.zip`
      console.log(`Downloading api doc from ${url}`);

      https.get(url, {
        headers: {
          'User-Agent': 'sitegen',
          Authorization: apiToken
        }
      }, response => {
        if (response.statusCode === 302) {
          console.log(`Got 302 redirecting to ${response.headers.location}`)
          https.get(response.headers.location, response => {
            downloadGitFile(response, fileName, repo).then(resolve);
          });

          return;
        }

        if (response.statusCode !== 200) {
          reject(`Invalid response code ${response.statusCode}`);
          return;
        }

        downloadGitFile(response, fileName, repo).then(resolve);
      });
    });
  });
}