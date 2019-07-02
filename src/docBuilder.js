const marked = require('marked');

function getContent(page, repo, graphql) {
    return graphql(`query {
        github {
          viewer {
            name
            repository(name: "${repo}") {
              first: object(expression: "master:doc/${page}") {
                id
                ... on Github_Blob {
                  text
                }
              }
            }
          }
        }
      }      
    `)
}

function processDocumentation(pages, repo, data, graphql) {
    return new Promise((resolve, reject) => {
        let p;
        let pageKeys = Object.keys(data.pages);

        for (const page of pageKeys) {
            if (!p) {
                p = getContent(data.pages[page], repo, graphql).then(result => {
                    pages[page] = marked(result.data.github.viewer.repository.first.text);

                    if (pageKeys.indexOf(page) + 1 === pageKeys.length) {
                        resolve();
                    }
                });
            } else {
                p.then(() => {
                    getContent(data.pages[page], repo, graphql).then(result => {
                        pages[page] = marked(result.data.github.viewer.repository.first.text);

                        if (pageKeys.indexOf(page) + 1 === pageKeys.length) {
                            resolve();
                        }
                    });
                });
            }
        }
    });
}

module.exports = {
    processDocumentation
};