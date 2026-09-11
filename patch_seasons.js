const fs = require('fs');
let code = fs.readFileSync('components/TVSeasons.tsx', 'utf8');

code = code.replace(
  "import Image from 'next/image';",
  "import Image from 'next/image';\nimport ScrollableRow from '@/components/ScrollableRow';"
);

code = code.replace(
  /<div className="flex gap-4 overflow-x-auto pb-8 snap-x -mx-4 px-4 md:mx-0 md:px-0 custom-scrollbar mask-fade-edges">/,
  "<ScrollableRow className=\"flex gap-4 overflow-x-auto pb-8 snap-x -mx-4 px-4 md:mx-0 md:px-0 custom-scrollbar mask-fade-edges\">"
);

// We need to replace the closing </div> of that flex container.
// We can use a regex for this specific block:
const regex = /(<ScrollableRow className="flex gap-4 overflow-x-auto pb-8 snap-x -mx-4 px-4 md:mx-0 md:px-0 custom-scrollbar mask-fade-edges">[\s\S]*?)<\/div>\s*<\/div>\s*<div className="flex-1 min-w-0">/;
code = code.replace(regex, "$1</ScrollableRow>\n      </div>\n      <div className=\"flex-1 min-w-0\">");

fs.writeFileSync('components/TVSeasons.tsx', code);
console.log('TVSeasons patched');
