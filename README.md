# Beautiful Album — Winter
A standalone CHERMO memory album. React + TypeScript + CSS 3D, with no 3D engine.

## Run
npm install
npm run dev

## Production
npm run build
npm run preview

Publish the contents of dist/ on a static HTTP host. Relative asset paths support a nested deployment. Opening index.html directly from the filesystem is not the supported module workflow.

## Personalize
Edit src/album-data.ts. WinterAlbum keeps the title, people, photos, captions, dates, chapters, letter and New Year message separate from rendering. Replace public/images/photo-01.jpg through photo-10.jpg with customer photographs, preserving the filenames or updating their src values. A future database adapter can return the same WinterAlbum structure and pass it to Album.

The ten chapters include the closed cover as chapter 01 and nine interior chapter spreads. Chapter 10 has a special-photo, receipt, returned-photo and hardcover-closing sequence. Photos open a keyboard-accessible native dialog. The letter, Christmas keepsake and New Year card open individually.

Navigation: cover tap/click, Next/Previous, page corner, arrow keys, and horizontal pointer drag/swipe on the paper. Vertical scrolling remains available on mobile. Escape closes dialogs. Motion respects prefers-reduced-motion. No autoplay audio.

## Sample content
Ella and Oliver, dates and memories are fictional demonstration content, including Christmas 2026 and New Year 2027. Ten locally stored Pexels photographs are illustrative, not customer photographs or a documented single couple's actual history. Replace them before personalized publication. The writing is original sample copy, not attributed quotations. Only the written material references were available during this build.

## Assets
Photos are locally stored compressed JPEGs, 1000px wide, approximately 995KB total. Photo IDs and download URLs are in photo-sources.json; source pages are https://www.pexels.com/photo/{id}/. Pexels license: https://www.pexels.com/license/.
Fonts: Cormorant Garamond, DM Sans and Caveat, served locally. Sources: Google Fonts repositories; SIL Open Font License. Snowflakes are original SVG geometry; paper and fabric textures are CSS/SVG. There are no runtime font/photo CDN requests.

## Scope
Original The days we keep and all unrelated experiences remain untouched. The Windows Vite resolve.preserveSymlinks option avoids restricted OneDrive realpath resolution in the build environment.

## Verification
Run npm test for the complete DOM-simulated interaction flow. It uses reduced motion and is not a real-browser layout/device test. See BEAUTIFUL-WINTER-CHECKPOINT.md for exact verification and current local-preview environment limits.
