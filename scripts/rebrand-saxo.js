const fs = require('fs');
const path = require('path');

const rootDir = 'c:/OpenclawAISE/Forex Brokers/forexbrokeratings';
const excludeDirs = ['.next', 'node_modules', '.git'];
const searchStr = 'Saxo Trading';
const replaceStr = 'Saxo Trading';

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        walk(filePath);
      }
    } else {
      const ext = path.extname(file);
      if (['.ts', '.tsx', '.md', '.json', '.js'].includes(ext)) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(searchStr)) {
          content = content.replace(new RegExp(searchStr, 'g'), replaceStr);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Updated: ${filePath}`);
        }
      }
    }
  }
}

try {
  walk(rootDir);
  console.log('Rebranding complete.');
} catch (err) {
  console.error('Error during rebranding:', err);
}
