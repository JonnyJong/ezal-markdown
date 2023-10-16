const renderer = require('../scripts/index');
const md = `Hello World
Next line.

Other para`;

renderer.render(md, {}).then(console.log);