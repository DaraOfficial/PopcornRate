const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

// I also need to adjust the padding on the inner nav items to match the button toggle `px-5 py-1.5`.
// Currently it is `px-4 py-2`.

code = code.replace(/px-4 py-2/g, 'px-5 py-1.5');

// Let's also adjust the spacing for the outer container, it has `p-1`.
// The toggle uses `p-0.5`.
code = code.replace(/p-1 /g, 'p-1.5 ');

fs.writeFileSync('components/Navbar.tsx', code);
console.log('Navbar padding patched');
