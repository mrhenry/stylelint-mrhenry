# [@mrhenry/stylelint-mrhenry-invalid-of-type-selectors](https://www.npmjs.com/package/@mrhenry/stylelint-mrhenry-invalid-of-type-selectors) [<img src="https://wp.assets.sh/uploads/sites/2963/2021/09/mrhenry-gezicht-small.png" alt="Mr. Henry's logo." width="90" height="90" align="right">](https://www.mrhenry.be/)

[![version](https://img.shields.io/npm/v/@mrhenry/stylelint-mrhenry-invalid-of-type-selectors.svg)](https://www.npmjs.com/package/@mrhenry/stylelint-mrhenry-invalid-of-type-selectors)

Warn when `:first-of-type` and similar selectors are used in selectors that do not match at least one type.
This rule is not fully accurate and will have false negatives (`foo .bar:first-of-type`), but it is accurate enough to create awareness around the general issue.

```css
/* invalid, the selector isn't a type selector */
.foo:first-of-type {}

/* valid, the selector is a type selector */
strong:first-of-type {}
```

