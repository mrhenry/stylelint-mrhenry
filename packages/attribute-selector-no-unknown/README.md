# [@mrhenry/stylelint-mrhenry-attribute-selector-no-unknown](https://www.npmjs.com/package/@mrhenry/stylelint-mrhenry-attribute-selector-no-unknown) [<img src="https://wp.assets.sh/uploads/sites/2963/2021/09/mrhenry-gezicht-small.png" alt="Mr. Henry's logo." width="90" height="90" align="right">](https://www.mrhenry.be/)

[![version](https://img.shields.io/npm/v/@mrhenry/stylelint-mrhenry-attribute-selector-no-unknown.svg)](https://www.npmjs.com/package/@mrhenry/stylelint-mrhenry-attribute-selector-no-unknown)

Disallow unknown attribute selectors.

```css
/* valid, the `name` attribute is allowed on button elements. */
button[name] {}

/* valid, the `name` attribute is not a global attribute, but used without a type selector. */
[name] {}

/* invalid, the `href` attribute is not allowed on button elements. */
button[href] {}
```

```css
/* valid, the `data-foo` attribute has a `data-*` prefix. */
[data-foo] {}

/* invalid, `foo` attribute doesn't exist. */
[foo] {}
```

Warns when attribute selectors are used that are not allowed on the given element.

While it is valid and allowed to use any attribute name on any element, it is not recommended to do so.

It is preferable to use the `data-*` attribute for custom attributes.

## Usage

`npm install --save-dev @mrhenry/stylelint-mrhenry-attribute-selector-no-unknown`

```js
// stylelint.config.js
module.exports = {
	plugins: [
		"@mrhenry/stylelint-mrhenry-attribute-selector-no-unknown",
	],
	rules: {
		"@mrhenry/stylelint-mrhenry-attribute-selector-no-unknown": true,
	},
}
```
