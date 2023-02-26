# [@mrhenry/stylelint-mrhenry-invalid-of-type-selectors](https://www.npmjs.com/package/@mrhenry/stylelint-mrhenry-invalid-of-type-selectors) [<img src="https://wp.assets.sh/uploads/sites/2963/2021/09/mrhenry-gezicht-small.png" alt="Mr. Henry's logo." width="90" height="90" align="right">](https://www.mrhenry.be/)

[![version](https://img.shields.io/npm/v/@mrhenry/stylelint-mrhenry-invalid-of-type-selectors.svg)](https://www.npmjs.com/package/@mrhenry/stylelint-mrhenry-invalid-of-type-selectors)

Disallow ambiguous `*-of-type` selectors.

```css
/* valid, the selector is a type selector */
strong:first-of-type {}

/* invalid, the selector isn't a type selector */
.foo:first-of-type {}
```

Warns when `:first-of-type` and similar selectors are used in selectors that do not match at least one type.
This rule is not fully accurate and will have false negatives (`foo .bar:first-of-type`), but it is accurate enough to create awareness around the general issue.

## Usage

`npm install --save-dev @mrhenry/stylelint-mrhenry-invalid-of-type-selectors`

```js
// stylelint.config.js
module.exports = {
	plugins: [
		"@mrhenry/stylelint-mrhenry-invalid-of-type-selectors",
	],
	rules: {
		"@mrhenry/stylelint-mrhenry-invalid-of-type-selectors": true,
	},
}
```
