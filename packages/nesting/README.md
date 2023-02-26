# [@mrhenry/stylelint-mrhenry-nesting](https://www.npmjs.com/package/@mrhenry/stylelint-mrhenry-nesting) [<img src="https://wp.assets.sh/uploads/sites/2963/2021/09/mrhenry-gezicht-small.png" alt="Mr. Henry's logo." width="90" height="90" align="right">](https://www.mrhenry.be/)

[![version](https://img.shields.io/npm/v/@mrhenry/stylelint-mrhenry-nesting.svg)](https://www.npmjs.com/package/@mrhenry/stylelint-mrhenry-nesting)

Specify a strict coding style for CSS nesting.

```css
/* valid, the nested selector is a "filter" for "focus" */
.element {
	&:focus {}
}

/* invalid, the nested selector is not a "filter" on the elements matched by the parent */
.foo {
	> .bar {}
}
```

Use CSS nesting only for conditional styling.
This style of CSS aims to be expressive and readable.

- only conditional at-rules
- every nested selector must start with `&`
- only a single pseudo after `&`

**Valid CSS :**

```css
.element {
	&:focus {
		/* when ".element" has focus */
	}

	&:is([data-theme=red]) {
		/* when ".element" has an attribute "data-theme" with value "red" */
	}

	&:is(body.some-modifier *) {
		/* when ".element" is a child of <body class="some-modifier"> */
	}

	&:has(img) {
		/* when ".element" has a child element of type "img" */
	}

	@media (prefers-color-scheme: dark) {
		/* when ".element" is shown in a dark mode context */
	}
}
```

**Invalid CSS :**

```css
/* invalid, the nested selector is not a "filter" on the elements matched by the parent */
.foo {
	> .bar {
		color: green;
	}
}

/* invalid, the nested selector is not a "filter" on the elements matched by the parent */
.foo {
	+ :focus {
		color: green;
	}
}

/* invalid, "@custom-selector" is not a conditional at-rule */
.foo {
	@custom-selector :--foo .bar;
}
```

## Usage

`npm install --save-dev @mrhenry/stylelint-mrhenry-nesting`

```js
// stylelint.config.js
module.exports = {
	plugins: [
		"@mrhenry/stylelint-mrhenry-nesting",
	],
	rules: {
		"@mrhenry/stylelint-mrhenry-nesting": true,
	},
}
```

## Optional secondary options

### `ignoreAtRules: [/regex/, "string"]`

```js
// stylelint.config.js
module.exports = {
	plugins: [
		"@mrhenry/stylelint-mrhenry-nesting",
	],
	rules: {
		"@mrhenry/stylelint-mrhenry-nesting": [
			true,
			{ ignoreAtRules: ["mixin"] }
		],
	},
}
```

Given:

```js
[/^custom-/i, "mixin"]
```

The following patterns are _not_ considered problems:

```css
.foo {
	@custom-selector :--bar .bar;
}
```

```css
.foo {
	@CUSTOM-MEDIA --bar (min-width: 320px);
}
```

```css
.foo {
	@mixin bar;
}
```
