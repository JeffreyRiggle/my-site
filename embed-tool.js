// Random tool I created to allow embedding loadable interactive content in markdown. 
// This uses a template that loads a piece of html later. This template is expected to use {{INNER_CONTENT}}
// as the placeholder for the content string
// node ./embed-tool.js <preview-template> <content-file> <output-file> 
// Example run
// node ./embed-tool.js ./preview-template.html ./content/blog/understanding-raster-roads/basic-road.html ./embedding-gen/index.html

const fs = require('node:fs');

fs.readFile(process.argv[3], 'utf-8', (err, loadableData) => {
    fs.readFile(process.argv[2], 'utf-8', (err, templateData) => {
            const loadContent = loadableData
                                    .replace(/\/\/[^\n]+\n/g, '')
                                    .replace(/[\r\n\t]/g, '')
                                    .replace(/\s+/g, ' ')
                                    .replace(/['"]/g, '\\\'')
                                    .replace('</script>', '<\\/script>');
            const previewContent = templateData.replace(/[\r\n\t]/g, '').replace(/\s+/g, ' ').replace('"', '\'').replace('{{INNER_CONTENT}}', loadContent);
            const fileContent = `<iframe height="400" width="600" style="border:none" srcdoc="${previewContent}"></iframe>`;

            fs.writeFile(process.argv[4], fileContent, 'utf-8', (err, data) => {
                console.log('File created');
            });
    });
});