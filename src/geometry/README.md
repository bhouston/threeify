# General

## Goals

* Simplifcation.

## Changes from Three.js:

* Removal of non-buffer-based geometry.
* Conversion of do nothing classes into proper factory functions.  For example BoxBufferGeometry in Three.js was a class that only had a constructor.  It appeared to have properties you could manipulate, but if you did nothing happened.  Thus it is best to convert it to a straight forward factory function.
