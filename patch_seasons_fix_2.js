const fs = require('fs');
let code = fs.readFileSync('components/TVSeasons.tsx', 'utf8');

// The file is a single line basically
// Let's find "        ))}      </div>      {activeSeason && ("
code = code.replace(
  "        ))}      </div>      {activeSeason && (",
  "        ))}      </ScrollableRow>      {activeSeason && ("
);

fs.writeFileSync('components/TVSeasons.tsx', code);
console.log('TVSeasons patched 2');
