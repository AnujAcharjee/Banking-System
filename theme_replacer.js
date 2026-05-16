const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

const replacements = [
  { search: /\btext-gray-900\b/g, replace: 'text-mine-shaft' },
  { search: /\btext-gray-800\b/g, replace: 'text-mine-shaft/80' },
  { search: /\btext-gray-700\b/g, replace: 'text-dusty-gray' },
  { search: /\btext-gray-600\b/g, replace: 'text-dusty-gray' },
  { search: /\btext-gray-500\b/g, replace: 'text-dusty-gray' },
  { search: /\btext-gray-400\b/g, replace: 'text-dusty-gray/80' },
  
  { search: /\bbg-gray-900\b/g, replace: 'bg-mine-shaft' },
  { search: /\bbg-gray-800\b/g, replace: 'bg-mine-shaft/90' },
  { search: /\bbg-gray-50\b/g, replace: 'bg-whisper' },
  
  { search: /\bborder-gray-50\b/g, replace: 'border-dusty-gray/10' },
  { search: /\bborder-gray-100\b/g, replace: 'border-dusty-gray/10' },
  { search: /\bborder-gray-200\b/g, replace: 'border-dusty-gray/30' },
  
  { search: /\border-orange-50\b/g, replace: 'border-rose-bud/10' },
  { search: /\border-orange-100\b/g, replace: 'border-rose-bud/20' },
  { search: /\bbg-orange-200\b/g, replace: 'bg-rose-bud/40' },
  { search: /\btext-orange-700\b/g, replace: 'text-spicy-mix' },
  { search: /\btext-orange-100\b/g, replace: 'text-rose-bud/50' },
];

let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  replacements.forEach(r => {
    content = content.replace(r.search, r.replace);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
    console.log('Updated', file);
  }
});

console.log(`Updated ${changedCount} files successfully (Pass 2).`);
