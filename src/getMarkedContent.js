const { Marked } = require('marked');
const { markedHighlight } = require("marked-highlight");
const prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

loadLanguages();
const marked = new Marked(
  markedHighlight({
    langPrefix: "language-",
    highlight(code, lang) {
      if (prism.languages[lang]) {
        return `<pre class="language-${lang}">${prism.highlight(code, prism.languages[lang], lang)}</pre>`;
      }
      return code;
    },
  })
);

function getMarkedContent(originalContent) {
  return marked.parse(originalContent);
}

module.exports = {
    getMarkedContent
}