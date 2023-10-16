[中文](./readme_zh.md)

# Ezal Markdown
A simple, asynchronous markdown renderer.

## Install
```sh
npm install --save ezal-markdown
```

## Use
```js
const { render } = require('ezal-markdown');

const markdown_content = `
# Title
Hello World.
`;

render(markdown_content).then(console.log);
```

## Develop
```sh
git clone git://github.com/JonnyJong/ezal-markdown.git
npm install -g typescript
tsc
```
