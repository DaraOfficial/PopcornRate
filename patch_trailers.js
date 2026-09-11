const fs = require('fs');
let code = fs.readFileSync('components/LatestTrailersRow.tsx', 'utf8');

code = code.replace(
  "import Image from 'next/image';",
  "import Image from 'next/image';\nimport ScrollableRow from '@/components/ScrollableRow';"
);

code = code.replace(
  /<div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 -mx-4 px-4 md:-mx-8 md:px-8 custom-scrollbar">/,
  "<ScrollableRow className=\"flex gap-5 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 -mx-4 px-4 md:-mx-8 md:px-8 custom-scrollbar\">"
);

// We need to replace the closing </div> of that flex container.
// It's after the map loop. 
// We can use a regex for this specific block:
const regex = /(<ScrollableRow className="flex gap-5[^>]*>[\s\S]*?)<\/div>\s*<\/div>\s*\{\/\* Video Error Message overlay \*\/\}/;
code = code.replace(regex, "$1</ScrollableRow>\n      </div>\n      {/* Video Error Message overlay */}");

fs.writeFileSync('components/LatestTrailersRow.tsx', code);
console.log('LatestTrailersRow patched');
