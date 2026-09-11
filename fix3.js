const fs = require('fs');
let code = fs.readFileSync('components/TVSeasons.tsx', 'utf8');

code = code.replace(/<\/div>\s*\{activeSeason/, '</ScrollableRow>\n      {activeSeason');

fs.writeFileSync('components/TVSeasons.tsx', code);
console.log('Fixed3');
