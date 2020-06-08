# General

## Goals

- Simplification
- Minimize dependencies

## Changes from Three.js

# Node

## Interface

- clone() : T
- copy( t: T )
- dispose() - indicates that resources can be released.

## Changes from Three.js

- position, rotation and scale use setters, getters and hide the versioning behind them.
- Removed automatic updating of local to world matrix.
- Rename worldMatrix to localToWorldMatrix per matrix naming conversions.
- add toLocalToWorldMatrix function to get the latest version of the matrices.
- Do not use backgrounds in the same fashion as Three.js as they lead to a lot of complexity with regards to render passes used in effects. Maybe the solution is not not have Backgrounds get into the WebGL renderer at all.
