const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

// Looking closely at the screenshots:
// the text is "Home", "Movies", "Shows", "My List" 
// The padding inside the pill is mostly horizontal. `px-5 py-2` looks good. `px-5 py-1.5` might be too short vertically.
// Let's change the inner pill to `px-6 py-2` to make it nice and wide.

code = code.replace(/px-5 py-1.5/g, 'px-6 py-2');

// And change the text sizes to be slightly larger so they match the toggle button feeling.
// text-[14px] is good.

fs.writeFileSync('components/Navbar.tsx', code);
console.log('Navbar padding patched 4');
