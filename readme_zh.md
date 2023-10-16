[English](./readme.md)

# Ezal Markdown
一个简单的、异步的 Markdown 渲染器。

## 安装
```sh
npm install --save ezal-markdown
```

## 使用
```js
const { render } = require('ezal-markdown');

const markdown_content = `
# Title
Hello World.
`;

render(markdown_content).then(console.log);
```

## 开发
```sh
git clone git://github.com/JonnyJong/ezal-markdown.git
npm install -g typescript
tsc
```
