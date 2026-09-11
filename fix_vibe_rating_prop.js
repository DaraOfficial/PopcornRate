const fs = require('fs');

let code = fs.readFileSync('components/MediaDetail.tsx', 'utf8');
code = code.replace(/<VibeRating mediaId={media.id} type={type} \/>/, '<VibeRating />');
fs.writeFileSync('components/MediaDetail.tsx', code);

console.log('Fixed VibeRating prop');
