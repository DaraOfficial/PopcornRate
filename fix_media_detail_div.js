const fs = require('fs');

let code = fs.readFileSync('components/MediaDetail.tsx', 'utf8');

// The `VibeRating` tag is still just `<VibeRating />` and the `div`s below it are messed up.
// Let's replace the whole Action Bar area.
const regex = /\{\/\* Action Bar \*\/\}[\s\S]*?\{\/\* Main Content Grid \*\/\}/;

const replacement = `{/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-8">
              
              <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full">
                <PopcornRating rating={ratingValue} className="w-5 h-5" showText={false} />
                <div className="w-[1px] h-6 bg-white/20"></div>
                <span className="font-bold text-lg text-white">
                  {ratingValue > 0 ? (ratingValue * 10).toFixed(0) + '%' : 'NR'}
                </span>
                <span className="text-white/50 text-sm font-medium ml-1">Score</span>
              </div>

              <VibeRating mediaId={media.id} type={type} />

              {media.videos?.results && media.videos.results.length > 0 && (
                <div className="sm:ml-auto">
                  <PlayTrailerButton videos={media.videos.results} className="bg-white text-black hover:bg-white/90 transition-transform hover:scale-105 px-8 py-4 rounded-full font-bold text-base flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.3)]" />
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
      </div>

      {/* Main Content Grid */}`;

code = code.replace(regex, replacement);
fs.writeFileSync('components/MediaDetail.tsx', code);
