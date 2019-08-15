const marked = require('marked');
const linkRegex = /\[(.*)\]\(([^#].*)\)/g;
const linkLocationRegex = /\((.*)\)/;
const webRequest = /http:|https:/i;

function getContent(page, repo, graphql) {
    return graphql(`query {
        github {
          viewer {
            name
            repository(name: "${repo}") {
              url
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

function processMarkdownImages(content, url) {
    let matches = content.match(linkRegex);

    if (!matches || !matches.length) {
        return content;
    }

    matches.forEach(match => {
        let link = match.match(linkLocationRegex)[1];

        if (webRequest.test(link)) {
            return;
        }

        const newValue = match.replace(link, `${url}/${link.substring(2, link.length)}`);
        content = content.replace(match, newValue);
    });

    return content;
}

function processDocumentation(pages, repo, data, graphql) {
    return new Promise((resolve, reject) => {
        let p;
        let pageKeys = Object.keys(data.pages);

        for (const page of pageKeys) {
            if (!p) {
                p = getContent(data.pages[page], repo, graphql).then(result => {
                    pages[page] = marked(processMarkdownImages(result.data.github.viewer.repository.first.text, `${result.data.github.viewer.repository.url}/raw/master/doc`));

                    if (pageKeys.indexOf(page) + 1 === pageKeys.length) {
                        resolve();
                    }
                });
            } else {
                p.then(() => {
                    getContent(data.pages[page], repo, graphql).then(result => {
                        pages[page] = marked(processMarkdownImages(result.data.github.viewer.repository.first.text, `${result.data.github.viewer.repository.url}/raw/master/doc`));

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
    processDocumentation,
    processMarkdownImages
};