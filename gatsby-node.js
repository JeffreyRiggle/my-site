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
                  object(expression: "master:README.md") {
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
              if (node.object && node.object.text) {
                content = marked(node.object.text);
              }
              
              if (!content) {
                console.log(`No content found for ${node.name} so no project page will be generated`);
                continue;
              }

              createPage({
                  path: node.name,
                  component: projectPageTemplate,
                  context: {
                      projectName: node.name,
                      content: content
                  }
              });
            }
            resolve();
        })
    })
}