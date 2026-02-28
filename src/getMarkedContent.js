const { marked } = require('marked');
const { markedHighlight } = require("marked-highlight");
const prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

loadLanguages();
marked.use(
  markedHighlight({
    langPrefix: "language-",
    highlight(code, lang) {
      const hasLang = lang && prism.languages[lang];
      const finalLang = hasLang ? lang : "plaintext";
      const grammar = prism.languages[finalLang] || prism.languages.plaintext;
      return prism.highlight(code, grammar, finalLang);
    },
  })
);

function getMarkedContent(originalContent) {
    return marked(originalContent);
}

module.exports = {
    getMarkedContent
}