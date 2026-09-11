const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

// The Latest Trailers button uses: `inline-flex items-center rounded-full border border-white/20 p-0.5 bg-white/5 backdrop-blur-md`
// The navbar currently uses: `flex items-center bg-[#0f1f13]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl px-2 py-1.5 h-[56px]`
// And the active pill currently uses: `bg-white text-black font-semibold shadow-md`

// I will make the overall pill darker and the border match the `border-white/20 p-0.5`.
// And the padding slightly smaller so it feels tighter, like the `p-0.5` in the toggle.

code = code.replace(
  'bg-[#0f1f13]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl px-2 py-1.5 h-[56px]',
  'bg-black/40 backdrop-blur-md border border-white/20 rounded-full shadow-2xl p-1 h-[56px]' // Added p-1 instead of px-2 py-1.5
);

// We need to keep the separator and right side layout, but the screenshot shows:
// The container is very dark green `bg-[#0f1f13]`
// The border is `border border-white/20`
// The padding is tight around the white pill.

code = code.replace(
  'bg-black/40 backdrop-blur-md border border-white/20 rounded-full shadow-2xl p-1 h-[56px]',
  'bg-[#0f1f13]/90 backdrop-blur-md border border-white/20 rounded-full shadow-2xl p-1 h-[56px]'
);

// We also need to change the active pill class from `bg-white` to exactly what the toggle button uses.
// The toggle button active class: `bg-white text-black font-semibold shadow-sm`
// Let's adjust the padding of the nav links to match the `p-0.5` tight feeling of the toggle.

const homeReplacement = `
          <Link 
            href="/" 
            className={\`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 \${
              pathname === '/' || pathname?.startsWith('/?q=') 
                ? 'bg-white text-black font-semibold shadow-md' 
                : 'text-white/70 hover:text-white font-medium hover:bg-white/10'
            }\`}
          >
            {pathname === '/' || pathname?.startsWith('/?q=') ? <Home className="w-[18px] h-[18px]" strokeWidth={2.5} /> : null}
            <span className="text-[14px] tracking-wide">Home</span>
          </Link>`;

code = code.replace(
  /<Link \n            href="\/"[\s\S]*?<\/Link>/,
  homeReplacement.trim()
);

const moviesReplacement = `
          <Link 
            href="/movies" 
            className={\`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 \${
              pathname === '/movies'
                ? 'bg-white text-black font-semibold shadow-md' 
                : 'text-white/70 hover:text-white font-medium hover:bg-white/10'
            }\`}
          >
            {pathname === '/movies' ? <Clapperboard className="w-[18px] h-[18px]" strokeWidth={2.5} /> : null}
            <span className="text-[14px] tracking-wide">Movies</span>
          </Link>`;
code = code.replace(
  /<Link \n            href="\/movies"[\s\S]*?<\/Link>/,
  moviesReplacement.trim()
);

const showsReplacement = `
          <Link 
            href="/tv" 
            className={\`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 \${
              pathname === '/tv'
                ? 'bg-white text-black font-semibold shadow-md' 
                : 'text-white/70 hover:text-white font-medium hover:bg-white/10'
            }\`}
          >
            {pathname === '/tv' ? <Tv className="w-[18px] h-[18px]" strokeWidth={2.5} /> : null}
            <span className="text-[14px] tracking-wide">Shows</span>
          </Link>`;
code = code.replace(
  /<Link \n            href="\/tv"[\s\S]*?<\/Link>/,
  showsReplacement.trim()
);
const listReplacement = `
          <Link 
            href="/list" 
            className={\`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 \${
              pathname === '/list'
                ? 'bg-white text-black font-semibold shadow-md' 
                : 'text-white/70 hover:text-white font-medium hover:bg-white/10'
            }\`}
          >
            {pathname === '/list' ? <Bookmark className="w-[18px] h-[18px]" strokeWidth={2.5} /> : null}
            <span className="text-[14px] tracking-wide">My List</span>
          </Link>`;

code = code.replace(
  /<Link \n            href="\/list"[\s\S]*?<\/Link>/,
  listReplacement.trim()
);

// We need to also adjust `pr-2 sm:pr-4` down to `pr-1 sm:pr-2` to tighten the overall gap around the elements.
code = code.replace(
  '<div className="flex items-center gap-1 sm:gap-3 pr-2 sm:pr-4">',
  '<div className="flex items-center gap-1 sm:gap-2 pr-1 sm:pr-3">'
);

fs.writeFileSync('components/Navbar.tsx', code);
console.log('Navbar border patched');
