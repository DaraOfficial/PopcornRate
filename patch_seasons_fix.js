const fs = require('fs');
let code = fs.readFileSync('components/TVSeasons.tsx', 'utf8');

code = code.replace(
  "          </div>\n        ))}\n      </div>\n      {activeSeason && (",
  "          </div>\n        ))}\n      </ScrollableRow>\n      {activeSeason && ("
);

fs.writeFileSync('components/TVSeasons.tsx', code);
console.log('TVSeasons patched');
