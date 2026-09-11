const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

// 1. Move to bottom on mobile, adjust translation
code = code.replace(
  /className=\{\`fixed top-4 sm:top-6 left-1\/2 -translate-x-1\/2 z-50 w-\[95\%\] sm:w-auto max-w-2xl transition-transform duration-300 ease-in-out flex justify-center \$\{\n        isHidden \? "-translate-y-\[150\%\]" : "translate-y-0"\n      \}\`\}/,
  'className={`fixed bottom-6 sm:bottom-auto sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-auto max-w-2xl transition-transform duration-300 ease-in-out flex justify-center ${isHidden ? "translate-y-[150%] sm:-translate-y-[150%]" : "translate-y-0"}`}'
);

// We need to replace the individual Link tags to handle mobile icon visibility and text hiding.
const homeMatch = /<Link\s+href="\/"\s+className={`flex items-center gap-2 px-3 sm:px-6 py-2 rounded-full transition-all duration-300 \${\s+pathname === "\/" \|\| pathname\?\.startsWith\("\/\?q="\)\s+\? "bg-white text-black font-semibold shadow-sm"\s+: "text-white\/70 hover:text-white font-medium hover:bg-white\/10"\s+}`}\s+>\s+\{pathname === "\/" \|\| pathname\?\.startsWith\("\/\?q="\) \? \(\s+<Home className="w-\[18px\] h-\[18px\]" strokeWidth=\{2\.5\} \/>\s+\) : null\}\s+<span className="text-\[13px\] sm:text-\[14px\] tracking-wide whitespace-nowrap">\s+Home\s+<\/span>\s+<\/Link>/;

const newHome = `<Link
            href="/"
            className={\`flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-2 rounded-full transition-all duration-300 \${
              pathname === "/" || pathname?.startsWith("/?q=")
                ? "bg-white text-black font-semibold shadow-sm"
                : "text-white/70 hover:text-white font-medium hover:bg-white/10"
            }\`}
          >
            <Home className={\`w-[20px] h-[20px] sm:w-[18px] sm:h-[18px] \${pathname === "/" || pathname?.startsWith("/?q=") ? "block" : "block sm:hidden"}\`} strokeWidth={2.5} />
            <span className="hidden sm:block text-[14px] tracking-wide whitespace-nowrap">
              Home
            </span>
          </Link>`;
          
const moviesMatch = /<Link\s+href="\/movies"\s+className={`flex items-center gap-2 px-3 sm:px-6 py-2 rounded-full transition-all duration-300 \${\s+pathname === "\/movies"\s+\? "bg-white text-black font-semibold shadow-sm"\s+: "text-white\/70 hover:text-white font-medium hover:bg-white\/10"\s+}`}\s+>\s+\{pathname === "\/movies" \? \(\s+<Clapperboard className="w-\[18px\] h-\[18px\]" strokeWidth=\{2\.5\} \/>\s+\) : null\}\s+<span className="text-\[13px\] sm:text-\[14px\] tracking-wide whitespace-nowrap">\s+Movies\s+<\/span>\s+<\/Link>/;

const newMovies = `<Link
            href="/movies"
            className={\`flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-2 rounded-full transition-all duration-300 \${
              pathname === "/movies"
                ? "bg-white text-black font-semibold shadow-sm"
                : "text-white/70 hover:text-white font-medium hover:bg-white/10"
            }\`}
          >
            <Clapperboard className={\`w-[20px] h-[20px] sm:w-[18px] sm:h-[18px] \${pathname === "/movies" ? "block" : "block sm:hidden"}\`} strokeWidth={2.5} />
            <span className="hidden sm:block text-[14px] tracking-wide whitespace-nowrap">
              Movies
            </span>
          </Link>`;

const tvMatch = /<Link\s+href="\/tv"\s+className={`flex items-center gap-2 px-3 sm:px-6 py-2 rounded-full transition-all duration-300 \${\s+pathname === "\/tv"\s+\? "bg-white text-black font-semibold shadow-sm"\s+: "text-white\/70 hover:text-white font-medium hover:bg-white\/10"\s+}`}\s+>\s+\{pathname === "\/tv" \? \(\s+<Tv className="w-\[18px\] h-\[18px\]" strokeWidth=\{2\.5\} \/>\s+\) : null\}\s+<span className="text-\[13px\] sm:text-\[14px\] tracking-wide whitespace-nowrap">\s+Shows\s+<\/span>\s+<\/Link>/;

const newTv = `<Link
            href="/tv"
            className={\`flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-2 rounded-full transition-all duration-300 \${
              pathname === "/tv"
                ? "bg-white text-black font-semibold shadow-sm"
                : "text-white/70 hover:text-white font-medium hover:bg-white/10"
            }\`}
          >
            <Tv className={\`w-[20px] h-[20px] sm:w-[18px] sm:h-[18px] \${pathname === "/tv" ? "block" : "block sm:hidden"}\`} strokeWidth={2.5} />
            <span className="hidden sm:block text-[14px] tracking-wide whitespace-nowrap">
              Shows
            </span>
          </Link>`;

const listMatch = /<Link\s+href="\/list"\s+className={`flex items-center gap-2 px-3 sm:px-6 py-2 rounded-full transition-all duration-300 \${\s+pathname === "\/list"\s+\? "bg-white text-black font-semibold shadow-sm"\s+: "text-white\/70 hover:text-white font-medium hover:bg-white\/10"\s+}`}\s+>\s+\{pathname === "\/list" \? \(\s+<Bookmark className="w-\[18px\] h-\[18px\]" strokeWidth=\{2\.5\} \/>\s+\) : null\}\s+<span className="text-\[13px\] sm:text-\[14px\] tracking-wide whitespace-nowrap">\s+My List\s+<\/span>\s+<\/Link>/;

const newList = `<Link
            href="/list"
            className={\`flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-2 rounded-full transition-all duration-300 \${
              pathname === "/list"
                ? "bg-white text-black font-semibold shadow-sm"
                : "text-white/70 hover:text-white font-medium hover:bg-white/10"
            }\`}
          >
            <Bookmark className={\`w-[20px] h-[20px] sm:w-[18px] sm:h-[18px] \${pathname === "/list" ? "block" : "block sm:hidden"}\`} strokeWidth={2.5} />
            <span className="hidden sm:block text-[14px] tracking-wide whitespace-nowrap">
              My List
            </span>
          </Link>`;


// Using regex to replace the exact blocks
code = code.replace(homeMatch, newHome);
code = code.replace(moviesMatch, newMovies);
code = code.replace(tvMatch, newTv);
code = code.replace(listMatch, newList);

// Adjust outer padding/layout to be responsive and spread out evenly on mobile
code = code.replace(
  'className="flex items-center bg-[#0f1f13]/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] p-1 "',
  'className="flex items-center justify-between w-full sm:w-auto bg-[#0f1f13]/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] p-1 px-3 sm:px-1"'
);

// Ensure the Links container also spreads out on mobile
code = code.replace(
  '<div className="flex items-center gap-1 sm:gap-2 pr-1 sm:pr-3">',
  '<div className="flex items-center justify-between w-full sm:w-auto gap-1 sm:gap-2 sm:pr-3">'
);

fs.writeFileSync('components/Navbar.tsx', code);
console.log('Navbar mobile bottom patched');
