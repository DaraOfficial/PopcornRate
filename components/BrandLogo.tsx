export default function BrandLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
      <style>
        {`
          @keyframes star-bounce {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.15) rotate(5deg); }
          }
          @keyframes pop-up {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          @keyframes kernel-pop {
            0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
            50% { transform: translateY(-6px) scale(1.1) rotate(25deg); }
          }
          .star-anim {
            transform-origin: 50px 68.5px;
            animation: star-bounce 2s ease-in-out infinite;
          }
          .fluff-anim {
            animation: pop-up 2.2s ease-in-out infinite;
          }
          .kernel-1 { animation: kernel-pop 1.8s ease-in-out infinite 0.1s; transform-origin: 20px 28px; }
          .kernel-2 { animation: kernel-pop 2.1s ease-in-out infinite 0.4s; transform-origin: 15px 34px; }
          .kernel-3 { animation: kernel-pop 1.7s ease-in-out infinite 0.7s; transform-origin: 85px 24px; }
        `}
      </style>
      
      <g className="fluff-anim">
        {/* Deep shadow for the popcorn crevices */}
        <path d="M 18 45 Q 15 25 35 25 Q 45 5 60 15 Q 75 10 80 25 Q 85 35 82 45 Z" fill="#D97706" />
        
        {/* Mid-tone Butter layer */}
        <path d="M 20 45 Q 18 28 35 28 Q 45 10 58 18 Q 72 14 78 26 Q 82 36 80 45 Z" fill="#FBBF24" />
        
        {/* Creamy white/yellow highlights - puffy popcorn pieces */}
        <circle cx="32" cy="32" r="8" fill="#FEF3C7" />
        <circle cx="44" cy="24" r="9" fill="#FEF3C7" />
        <circle cx="56" cy="22" r="10" fill="#FEF3C7" />
        <circle cx="70" cy="29" r="8" fill="#FEF3C7" />
        <circle cx="38" cy="39" r="7" fill="#FEF3C7" />
        <circle cx="50" cy="35" r="9" fill="#FEF3C7" />
        <circle cx="62" cy="37" r="8" fill="#FEF3C7" />
        <circle cx="28" cy="40" r="7" fill="#FEF3C7" />
        <circle cx="72" cy="40" r="7" fill="#FEF3C7" />

        {/* Inner kernel folds/creases (makes it look like popcorn, not grapes) */}
        <g stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8">
          {/* Left piece */}
          <path d="M 29 29 Q 34 32 30 36" />
          <path d="M 34 32 Q 36 30 38 31" />
          
          {/* Center-left piece */}
          <path d="M 42 20 Q 46 25 41 28" />
          
          {/* Center-right piece */}
          <path d="M 53 17 Q 58 22 53 27" />
          <path d="M 58 22 Q 62 20 63 24" />

          {/* Right piece */}
          <path d="M 68 25 Q 65 29 69 33" />
          
          {/* Bottom center pieces */}
          <path d="M 47 32 Q 52 35 48 40" />
          <path d="M 60 33 Q 57 37 62 41" />
        </g>
      </g>
      
      {/* Flying popcorn kernels with organic kernel shapes instead of raw circles */}
      <g fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1">
        <path d="M 20 28 C 16 23 25 20 27 25 C 30 23 32 28 29 30 C 26 33 19 32 20 28 Z" className="kernel-1" />
        <path d="M 14 34 C 11 31 17 29 18 32 C 20 31 22 34 20 35 C 18 37 13 36 14 34 Z" className="kernel-2" />
        <path d="M 82 24 C 79 19 87 16 89 21 C 92 19 94 24 91 26 C 88 29 81 28 82 24 Z" className="kernel-3" />
      </g>
      
      {/* Bucket Base (White) */}
      <path d="M 20 45 L 30 93 C 31 96 33 98 36 98 L 64 98 C 67 98 69 96 70 93 L 80 45 Z" fill="#FFFFFF" />
      
      {/* Red Stripes */}
      <path d="M 20 45 L 30 93 C 31 95 32 96.5 33.5 98 L 40 98 L 34 45 Z" fill="#EF4444" />
      <path d="M 45 45 L 47 98 L 53 98 L 55 45 Z" fill="#EF4444" />
      <path d="M 66 45 L 60 98 L 66.5 98 C 68 96.5 69 95 70 93 L 80 45 Z" fill="#EF4444" />
      
      {/* Bucket Top Rim */}
      <rect x="16" y="42" width="68" height="6" rx="3" fill="#DC2626" />
      
      {/* The "Rate" Star overlay */}
      <g transform="translate(0, 3)">
        <g className="star-anim">
          <path 
            d="M 50 54 L 54.5 64.5 L 66 65 L 56.5 72 L 59.5 83 L 50 76.5 L 40.5 83 L 43.5 72 L 34 65 L 45.5 64.5 Z" 
            fill="#FACC15" 
            stroke="#FFFFFF" 
            strokeWidth="3" 
            strokeLinejoin="round" 
          />
          {/* Inner star highlight for extra pop */}
          <path 
            d="M 50 58 L 53 65 L 60 65 L 54 70 L 56 77 L 50 73 L 44 77 L 46 70 L 40 65 L 47 65 Z" 
            fill="#FEF08A" 
          />
        </g>
      </g>
    </svg>
  );
}
