const fs = require('fs');

function replaceInFile(file, searchRegex, replace) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(searchRegex, replace);
  fs.writeFileSync(file, code);
  console.log(`Patched ${file}`);
}

// 1. DiscoverGrid.tsx
replaceInFile(
  'components/DiscoverGrid.tsx',
  /className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"/,
  'className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"'
);

// 2. MediaDetail.tsx
replaceInFile(
  'components/MediaDetail.tsx',
  /className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"/,
  'className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"'
);

// 3. app/page.tsx (Search results)
replaceInFile(
  'app/page.tsx',
  /className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"/,
  'className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 gap-y-10"'
);

