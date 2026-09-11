const fs = require('fs');

function replaceInFile(file, search, replace) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(search, replace);
  fs.writeFileSync(file, code);
  console.log(`Patched ${file}`);
}

replaceInFile('components/ScrollableRow.tsx',
  '"flex gap-4 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 -mx-4 px-4 md:-mx-8 md:px-8 custom-scrollbar"',
  '"flex gap-4 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 custom-scrollbar"'
);

replaceInFile('components/LatestTrailersRow.tsx',
  '"flex gap-5 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 -mx-4 px-4 md:-mx-8 md:px-8 custom-scrollbar"',
  '"flex gap-5 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 custom-scrollbar"'
);

replaceInFile('components/TVSeasons.tsx',
  '"flex gap-4 overflow-x-auto pb-8 snap-x -mx-4 px-4 md:mx-0 md:px-0 custom-scrollbar mask-fade-edges"',
  '"flex gap-4 overflow-x-auto pb-8 snap-x custom-scrollbar mask-fade-edges"'
);

