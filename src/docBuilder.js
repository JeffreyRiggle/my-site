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
        let allPages = [];

        for (const page of pageKeys) {
            let pageData = data.pages[page];

            if (typeof pageData === 'string' || pageData instanceof String) {
                allPages.push({
                    name: page,
                    file: pageData
                });

                continue;
            }

            if (!pageData.children && !pageData.children.length) {
                continue;
            }

            pageData.children.forEach(child => {
                console.log(`Found page ${child.displayName} with parent ${pageData.displayName}`);
                allPages.push({
                    name: child.displayName,
                    parent: pageData.displayName,
                    file: child.file
                });
            });
        }

        for (const page of allPages) {
            if (!p) {
                p = getContent(page.file, repo, graphql).then(result => {
                    const content = marked(processMarkdownImages(result.data.github.viewer.repository.first.text, `${result.data.github.viewer.repository.url}/raw/master/doc`));
                    
                    if (page.parent && pages[page.parent]) {
                        console.log(`Adding page ${child.name} to parent ${page.parent}`);
                        pages[page.parent].children.push({
                            displayName: page.name,
                            content
                        });
                    } else if (page.parent) {
                        console.log(`Setting up parent ${page.parent} with page ${child.name}`);
                        pages[page.parent] = {
                            displayName: page.parent,
                            children: [
                                {
                                    displayName: page.name,
                                    content
                                }
                            ]
                        };
                    } else {
                        pages[page.name] = content;
                    }

                    if (allPages.indexOf(page) + 1 === allPages.length) {
                        resolve();
                    }
                });
            } else {
                p.then(() => {
                    getContent(page.file, repo, graphql).then(result => {
                        const content = marked(processMarkdownImages(result.data.github.viewer.repository.first.text, `${result.data.github.viewer.repository.url}/raw/master/doc`));
                    
                        if (page.parent && pages[page.parent]) {
                            pages[page.parent].children.push({
                                displayName: page.name,
                                content
                            });
                        } else if (page.parent) {
                            pages[page.parent] = {
                                displayName: page.parent,
                                children: [
                                    {
                                        displayName: page.name,
                                        content
                                    }
                                ]
                            };
                        } else {
                            pages[page.name] = content;
                        }    

                        if (allPages.indexOf(page) + 1 === allPages.length) {
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