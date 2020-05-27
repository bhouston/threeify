# three.ts

Prototype of a Typescript-based Three.js

To run:

1. Install node.js & npm as appropriate for your platform.
2. Run npm install to install all the required node modules from package.json

```
npm install
```
 
3. Run webpack in dev-server mode, which includes hot-reloading

```
npm run start
```
 
The end result should be that a webbrowser window will open with a
dev-webserver open this example webpage:

```
dist/index.html
```

It will automatically reload when you change the source code that it is watching.

The bundle it produces will be here:

```
/dist/index.js      // compiled source code
/dist/index.js.map  // source maps
```
  
The bundle used for development will be large as it includes the webpack reloader.

If you want to build an optimized and small product version run:

```
npm run build
```
This will create only a small JavaScript file:

```
/dist.index.js
```
