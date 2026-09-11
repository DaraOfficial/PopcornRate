const fs = require('fs');
let code = fs.readFileSync('components/LatestTrailersRow.tsx', 'utf8');

// The toggle button currently uses: `bg-white/5 backdrop-blur-md border border-white/20`
// Let's enhance this as well to match the glassy look.

code = code.replace(
  'bg-white/5 backdrop-blur-md border border-white/20',
  'bg-white/10 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]'
);

fs.writeFileSync('components/LatestTrailersRow.tsx', code);
console.log('Toggle glass patched');
