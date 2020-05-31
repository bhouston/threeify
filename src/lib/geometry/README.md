Changes:

- Conversion of do not classes into factory functions.  For example BoxBufferGeometry in Three.js was a class that only had a constructor.  It appeared to have properties you could manipulate, but if you did nothing happened.  Thus it is best to convert it to a straight forward factory function.
- Removal of non-buffer-based geometry.



