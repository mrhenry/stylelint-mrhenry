# Changelog

## 3.2.0

- Add support for `EditInfo` in report warnings.

## 3.1.4

- Update dependencies

## 3.1.3

- Remove the `JSDoc` type annotation for the plugin to avoid forwards compat issues with subtle upstream type changes.

## 3.1.2

- Improved support for auto fixes
- Set minimum Stylelint version to `16.8.2`

## 3.1.1

- Update `@csstools/selector-specificity` to `v4.0.0`

## 3.1.0

- Add warnings for mixed specificity in nesting

## 3.0.1

- Add type annotations
- Allow nesting `@starting-style {}`

## 3.0.0

 - Migrate to `stylelint` `v16.0.0`

## 2.2.3

- Use `.cjs` files extensions.

## 2.2.2

- Fix `.foo { & + .bar {} }` becoming `.foo { &:is( + .bar) {} }`, it will now resolve to `.foo { &:is(& + .bar) {} }`

## 2.2.1

- Fix `.foo { & + .bar {} }` becoming `.foo { &:is( + .bar) {} }`, it will now resolve to `.foo { &:is(* + .bar) {} }`

## 2.2.0

- Add support for relative selectors by transforming `.foo { > img {} }` into `.foo { &:has(> img) {} }`

## 2.1.0

- Allow multiple `&` as long as the general pattern remains (e.g. `&:is(.bar &)`)
- Add `ignoreAtRules` plugin option so that non-standard things like `@mixins` can be allowed.
- Improve auto fixing.
- Fix plugin option `false`

## 2.0.0

- Change rule name to `@mrhenry/stylelint-mrhenry-nesting`

## 1.0.3

- Avoid unneeded `:is()` wrapping in auto fix

## 1.0.2

- Fix at-rule detection

## 1.0.1

- Fix files list

## 1.0.0

Initial release
