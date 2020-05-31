Coding Standard for the Math Library

If one is just setting the value fully, do not use make:
- Quaternion.setFromEuler()

If you are making a special version of a variable use the term "make", rather than set:
- Matrix4.makeIdentiy()
- Matrix4.makePerspectiveProjection()

If there are multiple types of makes of the same end result but different inputs use the pattern "make*From*"
- Matrix4.makeRotationFromQuaternion()

Each math class should have the following:
- clone()
- copy()
- equals()

When a function takes a single parameter, the parameter should be named after its type:
- v: Vector3
- q: Quaternion
- m: Matrix4

On Matrix4 these changes were made:
- Matrix4.inverse() : Matrix4 -> inplace inversion: Matrix4.invert().  Ben felt the semantics were unclear, this is more efficient as well.
- Matrix4.invert() always throws on degenerate matrix.  This is a serious error and should never be ignored.

