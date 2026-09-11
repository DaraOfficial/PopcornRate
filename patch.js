const fs = require('fs');
let code = fs.readFileSync('app/globals.css', 'utf8');

code = code.replace(
`  @media (min-width: 768px) {
    .custom-scrollbar::-webkit-scrollbar {
      height: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.4);
    }
    .custom-scrollbar {
      scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
      scrollbar-width: thin;
    }`,
`  @media (min-width: 768px) {
    .custom-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .custom-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }`
);

fs.writeFileSync('app/globals.css', code);
console.log('Patch applied');
