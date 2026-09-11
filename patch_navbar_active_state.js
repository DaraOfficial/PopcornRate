const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

// I need to update the active pill style in the Navbar to match: `bg-white text-black font-semibold shadow-sm`
// Instead of the current padding, let's make it tighter and rounder on the active element.
// Wait, looking at the image:
// The container is `p-1`.
// The inner active button is `bg-white text-black font-semibold shadow-sm`.
// The inner inactive button just doesn't have a background, so we just pad it.
// The toggle uses:
// button: `px-5 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-300`
// active: `bg-white text-black shadow-sm`
// inactive: `text-white/60 hover:text-white`

// The navbar is currently:
// `<Link ... className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 \${ active ? 'bg-white text-black font-semibold shadow-md' : 'text-white/70 hover:text-white font-medium hover:bg-white/10' }"`

code = code.replace(
  /bg-white text-black font-semibold shadow-md/g,
  'bg-white text-black font-semibold shadow-sm'
);

code = code.replace(
  /px-5 py-2.5/g,
  'px-4 py-2' // Shrink it slightly so the p-1 around it feels tighter like the image
);

fs.writeFileSync('components/Navbar.tsx', code);
console.log('Navbar active states patched');
