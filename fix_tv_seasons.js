const fs = require('fs');
let code = fs.readFileSync('components/TVSeasons.tsx', 'utf8');

// I will just use Prettier or standard regex to find <ScrollableRow ...> and replace its closing div.
code = code.replace(/<ScrollableRow([^>]*)>([\s\S]*?)<\/div>\s*\{activeSeason/, '<ScrollableRow$1>$2</ScrollableRow>      {activeSeason');

fs.writeFileSync('components/TVSeasons.tsx', code);
console.log('Fixed');
