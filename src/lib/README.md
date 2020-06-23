# Goals

- Inline JSDoc comments on most functions, variables.
- Utilize the typing from Typescript to generate rich documentation.
- Adopt semver? Probably is a good idea.

## Naming Convention

### Transform Matrix Names

- All matrices should be named in the form: [x]To[Y], where x is the originating space, and the y is the space after applying this matrix.
- If you invert a [x]To[Y] matrix, it should now be called [y]To[X].

Examples:

```js
const worldToLocal = new Matrix4();
const localToWorld = worldToLocal.clone.invert();

const localToScreenProjection = new Matrix4();
localToScreenProjection.makePerspectiveProjection(1.0, 1.0, 1000.0, 1.0);
const screenToLocalUnprojection = localToScreenProjection.clone().invert();
```

# Lines of Code

this
Calculated by `cloc src`:

2020-06-04: files ???, blank 522, comment 208, code 2535
2020-06-18: files 161, blank 1254, comment 874, code 5221
2020-06-23: files 194, blank 1549, comment 1018, code 6820
