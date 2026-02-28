const path = require('path');
const { processDocumentation, processMarkdownImages } = require('./src/docBuilder');
const { createFilePath } = require(`gatsby-source-filesystem`);
const unzipper = require('unzipper');
const fs = require('fs');
const https = require('https');
const apiToken = fs.readFileSync('token', 'utf8');
const { getMarkedContent } = require('./src/getMarkedContent');
const { graphql: githubGraphql } = require("@octokit/graphql");

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

function generateDocumentationPages(pages, createPage, projectPageTemplate, node, nodeData) {
  for (const page of Object.keys(pages)) {
    const pageData = pages[page];

    if (typeof pageData === 'string' || pageData instanceof String) {
      createPageFromMd(createPage, projectPageTemplate, node, page, pages, nodeData.index, !!nodeData.api);
      continue;
    }

    console.log(`Found parent page ${pageData.displayName} with children`);

    pageData.children.forEach(child => {
      createPageFromMd(createPage, projectPageTemplate, node, child.displayName, pages, nodeData.index, !!nodeData.api);
    });
  }
}

async function createGitPages(actions) {
  const { createPage } = actions;
  const projectPageTemplate = path.resolve('src/templates/project-page.jsx');

  const result = await githubGraphql(`query {
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
              ... on Blob {
                text
              }
            }
            second: object(expression: "master:doc/doc.json") {
              id
              ... on Blob {
                text
              }
            }
          }
      }
    }
  }
`, { headers: { authorization: `token ${process.env.GITHUB_TOKEN}` } });

  if (result.errors) {
    throw result.errors;
  }

  const nodes = result.viewer.repositories.nodes;
  for (const node of nodes) {
    console.log(`Processing ${node.name}`);
    let content = '';
    if (node.first && node.first.text) {
      content = getMarkedContent(processMarkdownImages(node.first.text, `${node.url}/raw/master`));
    }

    if (!content) {
      console.log(`No content found for ${node.name} so no project page will be generated`);
      continue;
    }

    let pages = {};

    if (node.second && node.second.text) {
      console.log(`found doc file ${node.name} with ${node.second.text}`);
      let nodeData = JSON.parse(node.second.text);
      await processDocumentation(pages, node.name, nodeData);
      pages['Github'] = content;
      generateDocumentationPages(pages, createPage, projectPageTemplate, node, nodeData);

      if (nodeData.api) {
        await createAPIDoc(node.name);
      }
    } else {
      console.log(`No doc file for ${node.name}`);
      pages['Github'] = content;
      createPageFromMd(createPage, projectPageTemplate, node, 'Github', pages, 'Github');
    }
  }
}

async function createBlogPosts(graphql, actions) {
  const { createPage } = actions;
  const blogPost = path.resolve('./src/templates/blog-post.jsx');
  const result = await graphql(
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
  );

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
}

exports.createPages = async ({ graphql, actions }) => {
  await createGitPages(actions);
  await createBlogPosts(graphql, actions);
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

const createAPIDoc = (repo) => {
  // This is a bit annoying but the only way I can think to do this would be
  // to release the documentation as a release
  console.log(`Creating api doc for ${repo}`);
  return new Promise((resolve, reject) => {
    githubGraphql(`
    query {
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
    `, { headers: { authorization: `token ${process.env.GITHUB_TOKEN}` } }).then(result => {
      if (result.errors) {
        reject(result.errors);
        return;
      }
  
      const url = result.viewer.repository.releases.nodes[0].releaseAssets.nodes[0].downloadUrl;
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