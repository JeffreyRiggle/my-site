const marked = require('marked');
const prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

loadLanguages();
marked.setOptions({
  highlight: (code, lang) => {
    if (prism.languages[lang]) {
        return `<pre class="language-${lang}">${prism.highlight(code, prism.languages[lang], lang)}</pre>`;
    }

    return code;
  }
});

function getMarkedContent(originalContent) {
    return marked(originalContent);
}

module.exports = {
    getMarkedContent
}