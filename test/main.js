const renderer = require('../scripts/index');
const fs = require('fs/promises');
const path = require('path');

async function main() {
  const md = await fs.readFile(path.join(__dirname, 'test.md'), 'utf-8');
  const { content } = await renderer.render(md, {});
  const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body><article>${content}</article></body></html>`;
  fs.writeFile(path.join(__dirname, 'test.html'), html, 'utf-8');
}

main();