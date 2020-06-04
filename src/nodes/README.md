# General

## Goals

* Simplification
* Minimize dependencies

## Changes from Three.js

# Node

## Interface

* clone() : T
* copy( t: T )
* dispose() - indicates that resources can be released. 

## Changes from Three.js

* Removed automatic updating of local to world matrix.
* Rename worldMatrix to localToWorldMatrix per matrix naming conversions.
* add toLocalToWorldMatrix function to get the latest version of the matrices.

