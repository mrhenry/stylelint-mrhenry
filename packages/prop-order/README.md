# [@mrhenry/stylelint-mrhenry-prop-order](https://www.npmjs.com/package/@mrhenry/stylelint-mrhenry-prop-order) [<img src="https://wp.assets.sh/uploads/sites/2963/2021/09/mrhenry-gezicht-small.png" alt="Mr. Henry's logo." width="90" height="90" align="right">](https://www.mrhenry.be/)

[![version](https://img.shields.io/npm/v/@mrhenry/stylelint-mrhenry-prop-order.svg)](https://www.npmjs.com/package/@mrhenry/stylelint-mrhenry-prop-order)

Specify a strict order for CSS properties.

```css
/* valid */
.foo {
	width: 100px;
	height: 20px;
}

/* invalid */
.foo {
	height: 20px; /* we prefer width before height */
	width: 100px;
}
```

```css
/* valid */
.foo {
	margin: 20px;
	margin-top: 10px;
}

/* invalid */
.foo {
	margin-top: 10px; /* longhand before a shorthand */
	margin: 20px;
}
```

This package doesn't create groups of properties.
But it will respect patterns that are often used to group properties:
- empty lines
- comments
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

## Usage

`npm install --save-dev @mrhenry/stylelint-mrhenry-prop-order`

```js
// stylelint.config.js
module.exports = {
	plugins: [
		"@mrhenry/stylelint-mrhenry-prop-order",
	],
	rules: {
		"@mrhenry/stylelint-mrhenry-prop-order": true,
	},
}
```

## List of properties :

The list is sourced from [`@webref/css`](https://www.npmjs.com/package/@webref/css).


## To update properties :

- `npm run update` (to get the latest `@webref/css`)
- `npm run test`

This will tell you which properties are missing.
