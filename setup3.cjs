// Herbal Hut - Icon & PWA Setup Script
// Run from project root: node setup3.cjs

const fs = require('fs');

console.log('🌿 Setting up icons and PWA for Herbal Hut...\n');

function write(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✅ Updated: ${filePath}`);
}

// ─── public/site.webmanifest ──────────────────────────────────────────────────
write('public/site.webmanifest', JSON.stringify({
  name: "Herbal Hut",
  short_name: "Herbal Hut",
  description: "Nature's remedies, straight from your kitchen",
  start_url: "/",
  display: "standalone",
  background_color: "#FDF6EC",
  theme_color: "#C45A0A",
  orientation: "portrait",
  icons: [
    {
      src: "/favicon-96x96.png",
      sizes: "96x96",
      type: "image/png"
    },
    {
      src: "/web-app-manifest-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/web-app-manifest-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable"
    }
  ]
}, null, 2));

// ─── index.html ───────────────────────────────────────────────────────────────
write('index.html', `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Primary Meta -->
    <title>Herbal Hut</title>
    <meta name="description" content="Nature's remedies, straight from your kitchen" />
    <meta name="theme-color" content="#C45A0A" />

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Apple / iPhone -->
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Herbal Hut" />

    <!-- PWA Manifest -->
    <link rel="manifest" href="/site.webmanifest" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`);

console.log('\n✅ Icons and PWA setup complete!\n');
console.log('Next steps:');
console.log('  1. Run: npm run build');
console.log('  2. Then: git add .');
console.log('  3. Then: git commit -m "Add app icons and PWA config"');
console.log('  4. Then: git push origin master');
console.log('  5. Wait for Netlify to redeploy');
console.log('  6. Open your app in Safari/Chrome and Add to Home Screen\n');
