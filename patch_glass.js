const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

// Currently it's: `bg-[#0f1f13]/90 backdrop-blur-md border border-white/20`
// To make it look more glassy, we should increase the blur, reduce the background opacity, and maybe tweak the border.
// `backdrop-blur-xl` or `backdrop-blur-2xl` for heavy glass effect.
// `bg-white/5` or `bg-black/30` or just a lower opacity of that dark color: `bg-[#0f1f13]/40`
// `border border-white/10` (softer border)
// We also want some inner shadow to give it that 3D glass edge, something like `shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]`

code = code.replace(
  'bg-[#0f1f13]/90 backdrop-blur-md border border-white/20 rounded-full shadow-2xl p-1',
  'bg-[#0f1f13]/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] p-1'
);

fs.writeFileSync('components/Navbar.tsx', code);
console.log('Navbar glass patched');
