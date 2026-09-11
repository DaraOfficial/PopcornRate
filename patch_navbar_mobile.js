const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

// The issue on small screens is that "My List" wraps because of whitespace and lack of `whitespace-nowrap`.
// Let's add `whitespace-nowrap` to the span texts inside the Links.
code = code.replace(
  /<span className="text-\[14px\] tracking-wide">Home<\/span>/g,
  '<span className="text-[14px] tracking-wide whitespace-nowrap">Home</span>'
);
code = code.replace(
  /<span className="text-\[14px\] tracking-wide">Movies<\/span>/g,
  '<span className="text-[14px] tracking-wide whitespace-nowrap">Movies</span>'
);
code = code.replace(
  /<span className="text-\[14px\] tracking-wide">Shows<\/span>/g,
  '<span className="text-[14px] tracking-wide whitespace-nowrap">Shows</span>'
);
code = code.replace(
  /<span className="text-\[14px\] tracking-wide">My List<\/span>/g,
  '<span className="text-[14px] tracking-wide whitespace-nowrap">My List</span>'
);

// We should also adjust the horizontal padding on smaller screens so the pill doesn't break the screen width.
// Currently it is `px-6 py-2`. On mobile, let's make it `px-4 sm:px-6`.
code = code.replace(/px-6 py-2/g, 'px-3 sm:px-6 py-2');

// Also the wrapper might need max-w-full and overflow-x-auto, but the pill should probably stay as one piece.
// Let's ensure the outer header has `w-full px-4` to prevent it bleeding off-screen.
code = code.replace(
  'className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-transform duration-300 ease-in-out ${',
  'className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-auto max-w-2xl transition-transform duration-300 ease-in-out flex justify-center ${'
);

// Inner container needs to be able to shrink or scroll if needed, but it's better if the font size scales down slightly or padding shrinks.
// Let's use `text-[13px] sm:text-[14px]`
code = code.replace(/text-\[14px\]/g, 'text-[13px] sm:text-[14px]');

fs.writeFileSync('components/Navbar.tsx', code);
console.log('Navbar mobile text wrapping fixed');
