yarn rollup ./dist/examples/gettingstarted/11_depthTexture/index.js --file ./dist/examples/gettingstarted/11_depthTexture/index.rollup.js --format iife --minifyInternalExports
yarn terser --compress --mangle --mangle-props -- ./dist/examples/gettingstarted/11_depthTexture/index.rollup.js --output ./dist/examples/gettingstarted/11_depthTexture/index.terser.js
brotli ./dist/examples/gettingstarted/11_depthTexture/index.terser.js
