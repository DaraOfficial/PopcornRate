const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

// I also need to adjust the outer container `p-1.5` back down a bit because the toggle is `p-0.5`. 
// The image shows very tight padding. Let's make the container padding `p-1`.

code = code.replace(/p-1.5 /g, 'p-1 ');

fs.writeFileSync('components/Navbar.tsx', code);
console.log('Navbar padding patched 3');
