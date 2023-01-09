# [@mrhenry/stylelint-mrhenry-prop-order](https://www.npmjs.com/package/@mrhenry/stylelint-mrhenry-prop-order) [<img src="https://wp.assets.sh/uploads/sites/2963/2021/09/mrhenry-gezicht-small.png" alt="Mr. Henry's logo." width="90" height="90" align="right">](https://www.mrhenry.be/)

[![version](https://img.shields.io/npm/v/@mrhenry/stylelint-mrhenry-prop-order.svg)](https://www.npmjs.com/package/@mrhenry/stylelint-mrhenry-prop-order)

Mr. Henry's preferred order for CSS properties.

This package does not group properties.
It only sorts them within "imaginary sections".

Acts as a separator between sections :
- ignored declarations
- empty lines
- comments

Ignored declarations :
- custom properties
- vendor prefixed CSS

```css
.foo {
  a: 0; /* section : 1 */
  b: 0; /* section : 1 */

  c: 0; /* section : 2 */
  d: 0; /* section : 2 */
  /* a comment */
  e: 0; /* section : 3 */
  f: 0; /* section : 3 */
  --a: 0; /* ignored */
  --b: 0; /* ignored */
  -webkit-foo: 0; /* ignored */
}
```

## List of properties :

The list is sourced from [`@webref/css`](https://www.npmjs.com/package/@webref/css).


## To update properties :

- `npm run update` (to get the latest `@webref/css`)
- `npm run test`

This will tell you which properties are missing.
