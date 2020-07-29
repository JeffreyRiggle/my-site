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

        let partialUrl = url;
        let backPath = link.startsWith('..');
        if (backPath) {
            partialUrl = partialUrl.substring(0, partialUrl.lastIndexOf('/'));
        }

        const newValue = match.replace(link, `${partialUrl}/${link.substring(backPath ? 3 : 2, link.length)}`);
        console.log(`Replacing ${link} with ${newValue}`);
        content = content.replace(match, newValue);
    });

    return content;
}

async function processDocumentation(pages, repo, data, graphql) {
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
            allPages.push({
                name: child.displayName,
                parent: pageData.displayName,
                file: child.file
            });
        });
    }

    for (const page of allPages) {
        const result = await getContent(page.file, repo, graphql);
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
    }
}

module.exports = {
    processDocumentation,
    processMarkdownImages
};