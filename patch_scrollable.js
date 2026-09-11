const fs = require('fs');
let code = fs.readFileSync('components/ScrollableRow.tsx', 'utf8');

code = code.replace(
  /<button\s+onClick=\{\(\) => scroll\('left'\)\}\s+className=\{`absolute left-2 md:left-4 top-1\/2 -translate-y-1\/2 -mt-3 z-50 bg-black\/40 backdrop-blur-xl w-14 h-14 rounded-full border border-white\/10 text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:scale-110 hidden md:flex items-center justify-center shadow-\[0_0_30px_rgba\(0,0,0,0\.8\)\] \$\{\s+showLeft \? 'opacity-0 group-hover\/row:opacity-100' : 'opacity-0 pointer-events-none'\s+\}`\}\s+aria-label="Scroll left"\s*>\s*<ChevronLeft className="w-8 h-8" strokeWidth=\{2\.5\} \/>\s*<\/button>/g,
  `<button
        onClick={() => scroll('left')}
        className={\`absolute left-0 top-2 bottom-8 w-16 md:w-20 z-50 bg-gradient-to-r from-[#000]/90 via-[#000]/50 to-transparent text-white transition-all duration-300 group/btn hidden md:flex items-center justify-start pl-2 \${
          showLeft ? 'opacity-0 group-hover/row:opacity-100' : 'opacity-0 pointer-events-none'
        }\`}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-10 h-10 transition-transform duration-300 group-hover/btn:scale-125 group-hover/btn:text-white text-white/70 drop-shadow-md" strokeWidth={2} />
      </button>`
);

code = code.replace(
  /<button\s+onClick=\{\(\) => scroll\('right'\)\}\s+className=\{`absolute right-2 md:right-4 top-1\/2 -translate-y-1\/2 -mt-3 z-50 bg-black\/40 backdrop-blur-xl w-14 h-14 rounded-full border border-white\/10 text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:scale-110 hidden md:flex items-center justify-center shadow-\[0_0_30px_rgba\(0,0,0,0\.8\)\] \$\{\s+showRight \? 'opacity-0 group-hover\/row:opacity-100' : 'opacity-0 pointer-events-none'\s+\}`\}\s+aria-label="Scroll right"\s*>\s*<ChevronRight className="w-8 h-8" strokeWidth=\{2\.5\} \/>\s*<\/button>/g,
  `<button
        onClick={() => scroll('right')}
        className={\`absolute right-0 top-2 bottom-8 w-16 md:w-20 z-50 bg-gradient-to-l from-[#000]/90 via-[#000]/50 to-transparent text-white transition-all duration-300 group/btn hidden md:flex items-center justify-end pr-2 \${
          showRight ? 'opacity-0 group-hover/row:opacity-100' : 'opacity-0 pointer-events-none'
        }\`}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-10 h-10 transition-transform duration-300 group-hover/btn:scale-125 group-hover/btn:text-white text-white/70 drop-shadow-md" strokeWidth={2} />
      </button>`
);

fs.writeFileSync('components/ScrollableRow.tsx', code);
console.log('ScrollableRow edge navigation patched');
