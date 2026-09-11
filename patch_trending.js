const fs = require('fs');
let code = fs.readFileSync('components/TrendingRow.tsx', 'utf8');

code = code.replace(
  "import MovieCard from '@/components/MovieCard';",
  "import MovieCard from '@/components/MovieCard';\nimport ScrollableRow from '@/components/ScrollableRow';"
);

code = code.replace(
  /<div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 -mx-4 px-4 md:-mx-8 md:px-8 custom-scrollbar">\s*\{items\.map\(\(item: any\) => \(\s*<div key=\{item\.id\} className="snap-start shrink-0 w-\[140px\] sm:w-\[160px\] md:w-\[180px\] lg:w-\[200px\]">\s*<MovieCard movie=\{item\} \/>\s*<\/div>\s*\)\)\}\s*<\/div>/,
  "<ScrollableRow>\n        {items.map((item: any) => (\n          <div key={item.id} className=\"snap-start shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]\">\n            <MovieCard movie={item} />\n          </div>\n        ))}\n      </ScrollableRow>"
);

fs.writeFileSync('components/TrendingRow.tsx', code);
console.log('TrendingRow patched');
