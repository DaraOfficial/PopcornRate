const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

// I need to fix the separator and right side on mobile.
// Wait, the container has `w-full sm:w-auto`.
// The inner links div has `w-full sm:w-auto`.
// This means the links will expand to fill space, pushing the separator and icons off screen if we aren't careful, but `justify-between` and `gap` should handle it.
// However, the search input might expand on mobile.

// Let's ensure the icons look good on mobile.
code = code.replace(
  'className={`w-[20px] h-[20px] sm:w-[18px] sm:h-[18px] ${pathname === "/" || pathname?.startsWith("/?q=") ? "block" : "block sm:hidden"}`}',
  'className={`w-[20px] h-[20px] sm:w-[18px] sm:h-[18px] ${pathname === "/" || pathname?.startsWith("/?q=") ? "block" : "block sm:hidden"}`}'
);

// One thing: on mobile, if a link is ACTIVE, it will have `bg-white text-black font-semibold shadow-sm`.
// If it is INACTIVE, it just shows the icon.
// The padding `px-4 py-2.5` on mobile makes the active pill look good.
// The inactive icons will just have `px-4 py-2.5` without background. That's a good touch target.

// What about the separator? 
// `<div className="w-[1px] h-6 bg-white/20 mx-1 sm:mx-2"></div>`
// Let's hide the separator and right icons on mobile to keep it super clean?
// Or keep them. Usually bottom nav bars don't have search and settings inside the middle of them.
// Wait, if it's `justify-between`, keeping Search is fine. 
// Let's just make sure they shrink correctly.
code = code.replace(
  '<div className="w-[1px] h-6 bg-white/20 mx-1 sm:mx-2"></div>',
  '<div className="hidden sm:block w-[1px] h-6 bg-white/20 mx-1 sm:mx-2"></div>'
);
code = code.replace(
  '<div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2 pr-2">',
  '<div className="hidden sm:flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2 pr-2">'
);

// We need a search icon on mobile somewhere. 
// If the bottom bar is just navigation, where does Search go on mobile?
// Let's keep it in the bottom bar, just don't hide it.
code = code.replace(
  '<div className="hidden sm:block w-[1px] h-6 bg-white/20 mx-1 sm:mx-2"></div>',
  '<div className="block w-[1px] h-6 bg-white/20 mx-1 sm:mx-2"></div>'
);
code = code.replace(
  '<div className="hidden sm:flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2 pr-2">',
  '<div className="flex items-center gap-1 sm:gap-3 pl-1 sm:pl-2 pr-1 sm:pr-2">'
);

// For the Settings icon, hide it on mobile to save space if needed?
// Let's leave it.

fs.writeFileSync('components/Navbar.tsx', code);
