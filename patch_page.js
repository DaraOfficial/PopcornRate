const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

// The regex below removes the unused MediaRow function.
const regex = /\/\/ Reusable component for horizontal scrolling lists\nfunction MediaRow[^}]*\}[^}]*\}[^}]*\}[^}]*\}/;
// Actually MediaRow is about 25 lines. Let's just find and replace using standard replace if possible or regex.

code = code.replace(
  "import { Suspense } from 'react';\n\n// Reusable component for horizontal scrolling lists\nfunction MediaRow({ title, items }: { title: string, items: any[] }) {\n  if (!items || items.length === 0) return null;\n  \n  return (\n    <div className=\"mb-12\">\n      <div className=\"flex items-center justify-between mb-6\">\n        <h2 className=\"text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-sm\">\n          {title}\n        </h2>\n        <button className=\"text-[13px] font-semibold text-white/50 hover:text-white transition-colors flex items-center gap-1\">\n          See All <ChevronRight className=\"h-3.5 w-3.5\" />\n        </button>\n      </div>\n      \n      <div className=\"flex gap-4 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 -mx-4 px-4 md:-mx-8 md:px-8 custom-scrollbar\">\n        {items.map((item: any) => (\n          <div key={item.id} className=\"snap-start shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]\">\n            <MovieCard movie={item} />\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n}",
  "import { Suspense } from 'react';"
);

fs.writeFileSync('app/page.tsx', code);
console.log('page.tsx patched');
