# Changelog

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
