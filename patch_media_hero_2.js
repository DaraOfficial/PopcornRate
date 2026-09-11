const fs = require('fs');

let code = fs.readFileSync('components/MediaDetail.tsx', 'utf8');

// Update the gradient masks to be more "Cineby" (darker, cinematic edge fade)
code = code.replace(
  `            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />\n            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent md:w-3/4" />`,
  `            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />\n            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent md:w-2/3" />\n            <div className="absolute inset-0 bg-black/20" /> {/* Slight darkening for text contrast */}`
);

fs.writeFileSync('components/MediaDetail.tsx', code);
console.log('Hero gradient patched');
