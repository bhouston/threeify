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

|    Date    | Files | Blank Lines | Comment Lines | Code Lines |
| :--------: | ----: | ----------: | ------------: | ---------: |
| 2020-06-04 |   ??? |         522 |           208 |       2535 |
| 2020-06-18 |   161 |        1254 |           874 |       5221 |
| 2020-06-23 |   194 |        1549 |          1018 |       6820 |
| 2020-07-04 |   234 |        2027 |          1216 |       9200 |
| 2020-07-22 |   314 |        2473 |          1323 |      11339 |
