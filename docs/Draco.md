Studying how Three.js loads it:

var dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('path/to/decoders/');
dracoLoader.setDecoderConfig({type: 'js'}); // (Optional) Override detection of WASM support.

Can I only use the WARM version?  Does Safari support WASM?  Yes.  Thus only use the WASM version.

librariesPending.push( this._loadLibrary( 'draco_wasm_wrapper.js', 'text' ) );
librariesPending.push( this._loadLibrary( 'draco_decoder.wasm', 'arraybuffer' ) );

It seems to make a custom Js file which it passes into the webworker as an ObjectURL?

```js
const jsContent = await fetch( 'draco_wasm_wrapper.js', text );
const wasmBinary = await fetch( 'draco_decoarder.wasm', arraybuffer );

const fn = DRACOWorker.toString();

const body = [
    '/* draco decoder */',
    jsContent,
    '',
    '/* worker */',
    fn.substring( fn.indexOf( '{' ) + 1, fn.lastIndexOf( '}' ) )
].join( '\n' );

this.workerSourceURL = URL.createObjectURL( new Blob( [ body ] ) );
```

The web assembly gets passed into the webworker as decoderConfig.

```js
decoderPending = new Promise( function ( resolve/*, reject*/ ) {

decoderConfig.onModuleLoaded = function ( draco ) {

    // Module is Promise-like. Wrap before resolving to avoid loop.
    resolve( { draco: draco } );

};

DracoDecoderModule( decoderConfig ); // eslint-disable-line no-undef
```


According to MSN, the most modern way of loading WASM is this:

```js
WebAssembly.instantiateStreaming(fetch("simple.wasm"), importObject).then(
  (results) => {
    // Do something with the results!
  }
);
```

