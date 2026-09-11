const fs = require('fs');

let code = fs.readFileSync('components/MediaDetail.tsx', 'utf8');

// Modernize the Overview section
code = code.replace(
  `            <section>\n              <h2 className="text-sm font-bold tracking-widest text-white/40 uppercase mb-4">Storyline</h2>`,
  `            <section className="bg-white/5 border border-white/5 rounded-3xl p-6 md:p-10 backdrop-blur-sm">\n              <h2 className="text-sm font-bold tracking-widest text-white/50 uppercase mb-6 flex items-center gap-3">\n                <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>\n                Storyline\n              </h2>`
);

// Modernize the Top Cast section
code = code.replace(
  `            {cast.length > 0 && (\n              <section>\n                <div className="flex items-center justify-between mb-6">\n                  <h2 className="text-sm font-bold tracking-widest text-white/40 uppercase">Top Cast</h2>\n                </div>`,
  `            {cast.length > 0 && (\n              <section>\n                <div className="flex items-center justify-between mb-8">\n                  <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">\n                    Cast\n                  </h2>\n                </div>`
);

fs.writeFileSync('components/MediaDetail.tsx', code);
console.log('Content patched');
