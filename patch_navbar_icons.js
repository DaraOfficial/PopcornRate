const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

// Add new icons from lucide-react
code = code.replace(
  "import { Home, Search, Settings } from 'lucide-react';",
  "import { Home, Search, Settings, Clapperboard, Tv, Bookmark } from 'lucide-react';"
);

// We need to update the links so they have icons when active, and only show text otherwise
// Or show text + icon when active, and just text when inactive, similar to the Home button currently.
// The screenshots show:
// Movies (active) -> [Clapperboard icon] Movies
// Shows (active) -> [Tv icon] Shows
// My List (active) -> [Bookmark icon] My List

// Also update the navbar background color to match the darker green tint in the screenshots.
code = code.replace(
  /bg-\[\#654e38\]\/80 backdrop-blur-xl border border-white\/10 rounded-full shadow-2xl px-2 py-1.5 h-\[56px\]/,
  'bg-[#0f1f13]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl px-2 py-1.5 h-[56px]'
);

const homeReplacement = `
          <Link 
            href="/" 
            className={\`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 \${
              pathname === '/' || pathname?.startsWith('/?q=') 
                ? 'bg-white text-black font-semibold shadow-md' 
                : 'text-white/80 hover:text-white font-medium hover:bg-white/10'
            }\`}
          >
            {pathname === '/' || pathname?.startsWith('/?q=') ? <Home className="w-[18px] h-[18px]" strokeWidth={2.5} /> : null}
            <span className="text-[14px] tracking-wide">Home</span>
          </Link>`;

const moviesReplacement = `
          <Link 
            href="/movies" 
            className={\`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 \${
              pathname === '/movies'
                ? 'bg-white text-black font-semibold shadow-md' 
                : 'text-white/80 hover:text-white font-medium hover:bg-white/10'
            }\`}
          >
            {pathname === '/movies' ? <Clapperboard className="w-[18px] h-[18px]" strokeWidth={2.5} /> : null}
            <span className="text-[14px] tracking-wide">Movies</span>
          </Link>`;

const showsReplacement = `
          <Link 
            href="/tv" 
            className={\`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 \${
              pathname === '/tv'
                ? 'bg-white text-black font-semibold shadow-md' 
                : 'text-white/80 hover:text-white font-medium hover:bg-white/10'
            }\`}
          >
            {pathname === '/tv' ? <Tv className="w-[18px] h-[18px]" strokeWidth={2.5} /> : null}
            <span className="text-[14px] tracking-wide">Shows</span>
          </Link>`;
          
const listReplacement = `
          <Link 
            href="/list" 
            className={\`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 \${
              pathname === '/list'
                ? 'bg-white text-black font-semibold shadow-md' 
                : 'text-white/80 hover:text-white font-medium hover:bg-white/10'
            }\`}
          >
            {pathname === '/list' ? <Bookmark className="w-[18px] h-[18px]" strokeWidth={2.5} /> : null}
            <span className="text-[14px] tracking-wide">My List</span>
          </Link>`;

code = code.replace(
  /<Link \n            href="\/"[\s\S]*?<\/Link>/,
  homeReplacement.trim()
);
code = code.replace(
  /<Link \n            href="\/movies"[\s\S]*?<\/Link>/,
  moviesReplacement.trim()
);
code = code.replace(
  /<Link \n            href="\/tv"[\s\S]*?<\/Link>/,
  showsReplacement.trim()
);
code = code.replace(
  /<Link \n            href="\/list"[\s\S]*?<\/Link>/,
  listReplacement.trim()
);

fs.writeFileSync('components/Navbar.tsx', code);
console.log('Navbar icons patched');
