const fs = require('fs');

function replaceInFile(file, searchRegex, replace) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(searchRegex, replace);
  fs.writeFileSync(file, code);
  console.log(`Patched ${file}`);
}

const standardRowWidth = 'className="snap-start shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] xl:w-[220px]"';
const oldRowWidthRegex = /className="snap-start shrink-0 w-\[140px\] sm:w-\[160px\] md:w-\[180px\] lg:w-\[200px\]"/g;

replaceInFile('components/TrendingRow.tsx', oldRowWidthRegex, standardRowWidth);
replaceInFile('components/WhatsPopularRow.tsx', oldRowWidthRegex, standardRowWidth);
replaceInFile('components/FreeToWatchRow.tsx', oldRowWidthRegex, standardRowWidth);

// TVSeasons has a different old string
const standardSeasonWidth = 'className={`w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] xl:w-[220px] shrink-0 snap-start group bg-white/5 border rounded-xl overflow-hidden hover:bg-white/10 transition-colors cursor-pointer ${activeSeason === season.season_number ? \'border-white/50 ring-2 ring-white/20\' : \'border-white/10\'}`}';
const oldSeasonRegex = /className=\{`w-\[140px\] md:w-\[160px\] shrink-0 snap-start group bg-white\/5 border rounded-xl overflow-hidden hover:bg-white\/10 transition-colors cursor-pointer \$\{activeSeason === season.season_number \? 'border-white\/50 ring-2 ring-white\/20' : 'border-white\/10'\}`\}/;

replaceInFile('components/TVSeasons.tsx', oldSeasonRegex, standardSeasonWidth);

