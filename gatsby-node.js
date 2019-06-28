const path = require('path');
const marked = require('marked');

exports.createPages = ({ graphql, boundActionCreators }) => {

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
                  second: object(expression: "master:doc.json") {
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
              pages['Github'] = content;

              createPage({
                  path: node.name,
                  component: projectPageTemplate,
                  context: {
                      projectName: node.name,
                      projectUrl: node.url,
                      currentPage: 'Github',
                      pages: pages
                  }
              });
            }
            resolve();
        })
    })
}