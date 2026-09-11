const fs = require('fs');

let code = fs.readFileSync('components/MediaDetail.tsx', 'utf8');

// Replace the Hero Section to include a floating poster for the Cineby style
code = code.replace(
  /<div className="max-w-4xl">\s*\{\/\* Metadata Badges \*\/\}/,
  `<div className="flex flex-col md:flex-row gap-8 md:gap-12 items-end md:items-end">
            
            {/* Floating Poster (Desktop) */}
            {media.poster_path && (
              <div className="hidden md:block w-48 lg:w-64 shrink-0 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-1 ring-white/20 transform transition-transform duration-700 hover:scale-105 hover:-translate-y-2 translate-y-8">
                <div className="relative aspect-[2/3] w-full">
                  <Image src={getImageUrl(media.poster_path, 'w500')} alt={title} fill className="object-cover" />
                </div>
              </div>
            )}
            
            {/* Title & Metadata */}
            <div className="flex-1 max-w-3xl pb-2">
              {/* Floating Poster (Mobile) */}
              {media.poster_path && (
                <div className="md:hidden w-32 shrink-0 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20 mb-6 -mt-32">
                  <div className="relative aspect-[2/3] w-full">
                    <Image src={getImageUrl(media.poster_path, 'w500')} alt={title} fill className="object-cover" />
                  </div>
                </div>
              )}
              
              {/* Metadata Badges */}`
);

code = code.replace(
  `              <VibeRating mediaId={media.id} type={type} />\n            </div>\n          </div>\n        </div>\n      </div>`,
  `              <VibeRating mediaId={media.id} type={type} />\n            </div>\n          </div>\n          </div>\n        </div>\n      </div>` // Added one closing div for the new flex container
);

fs.writeFileSync('components/MediaDetail.tsx', code);
console.log('Hero patched');
