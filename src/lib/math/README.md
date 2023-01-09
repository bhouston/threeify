# General

## Goals

- Simplification
- Minimize dependencies

## Naming Conventions

If one is just setting the value fully, do not use make:

- Quaternion.setFromEuler()

If you are making a special version of a variable use the term "make", rather than set:

- Mat4.makeIdentity()
- Mat4.makePerspectiveProjection()

If there are multiple types of makes of the same end result but different inputs use the pattern "make*From*"

- Mat4.makeRotationFromQuaternion()

When a function takes a single parameter, the parameter should be named after its type:

- v: Vec3
- q: Quaternion
- m: Mat4

## Expected Function in a Math Class

Each math class should have the following:

- clone()
- copy( t: T )
- equals( t: T )

## Changes from Three.js

- Removed event emitters from Quaternion and Euler3. This causes unnecessary complexity. We can change the update structure in the Node class to compensate.

# Mat4

## Changes from Three.js

- Always use the primitive instead of a destructured set of variables in a method call: e.g. makeTranslation( v: Vec3) rather than makeTranslation( x: number, y: number, z: number )
- A bunch of name changes based on the above naming conventions.
- Mat4.inverse() : Mat4 -> inplace inversion: Mat4.invert(). Ben felt the semantics were unclear, this is more efficient as well.
- Mat4.invert() always throws on degenerate matrix. This is a serious error and should never be ignored.
