/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const preloadPath = path.join(projectRoot, 'dist-electron', 'preload', 'index.js');
let content = fs.readFileSync(preloadPath, 'utf8');

// Convert ES module imports to CommonJS require
content = content.replace(
  /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"];?/g,
  (match, imports, module) => {
    const importList = imports.split(',').map(i => i.trim());
    return `const { ${importList.join(', ')} } = require('${module}');`;
  }
);

// Convert export type to nothing (remove it)
content = content.replace(/export\s+type\s+\w+\s*=\s*typeof\s+\w+;?/g, '');

fs.writeFileSync(preloadPath, content);
console.log('Converted preload to CommonJS');