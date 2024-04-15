# Changelog

## 3.0.9

- Add new properties:
  - `position-visibility`

## 3.0.8

- Add new properties:
  - `position-anchor`
- Remove unknown properties:
  - `anchor-default`

## 3.0.7

- Add new properties:
  - `anchor-scope`
- Remove unknown properties:
  - `position-animation`

## 3.0.6

- Remove unknown properties:
  - `position-fallback-bounds`

## 3.0.5

- Add new properties:
  - `dynamic-range-limit`

## 3.0.4

- Add new properties:
  - `caret-animation`
  - `position-animation`
  - `position-try`
  - `reading-order-items`
- Remove unknown properties:
  - `layout-order`
  - `reading-order`

## 3.0.3

- Add new properties:
  - `view-transition-class`
- Remove unknown properties:
  - `position-try-final`

## 3.0.2

- Add new properties:
  - `font-width`
  - `position-try-final`
  - `position-try-options`
  - `position-try-order`
  - `zoom`
- Remove unknown properties:
  - `position-fallback`

## 3.0.1

- Add type annotations

## 3.0.0

 - Migrate to `stylelint` `v16.0.0`

## 2.0.16

- Add new properties:
  - `inset-area`

## 2.0.15

- Fix exception on `atrule`'s without nodes

## 2.0.14

- Fix sorting of nested properties

## 2.0.13

- Add new properties:
  - `field-sizing`
- Remove unknown properties:
  - `align-tracks`
  - `justify-tracks`

## 2.0.12

- Add new properties:
  - `font-synthesis-position`
  - `text-wrap-mode`
  - `text-wrap-style`
  - `transition-behavior`
  - `word-space-transform`
- Remove unknown properties:
  - `word-boundary-detection`
  - `word-boundary-expansion`

## 2.0.11

- Remove unknown properties:
  - `anchor-scroll`

## 2.0.10

- Use `.cjs` files extensions.

## 2.0.9

- Add new properties:
  - `position-fallback-bounds`
  - `timeline-scope`
- Remove unknown properties:
  - `scroll-timeline-attachment`
  - `view-timeline-attachment`

## 2.0.8

- Add new properties:
  - `scroll-start`
  - `scroll-start-block`
  - `scroll-start-inline`
  - `scroll-start-target`
  - `scroll-start-target-block`
  - `scroll-start-target-inline`
  - `scroll-start-target-x`
  - `scroll-start-target-y`
  - `scroll-start-x`
  - `scroll-start-y`

## 2.0.7

- Remove unknown properties:
  - `scroll-start`
  - `scroll-start-block`
  - `scroll-start-inline`
  - `scroll-start-target`
  - `scroll-start-x`
  - `scroll-start-y`

## 2.0.6

- Add new properties:
  - `scroll-timeline-attachment`
  - `view-timeline-attachment`

## 2.0.5

- Add new properties:
  - `overlay`
  - `text-box-edge`
  - `text-box-trim`
- Removed unknown properties:
  - `leading-trim`
  - `text-edge`

## 2.0.4

- Add new properties:
  - `white-space-trim`
- Removed unknown properties:
  - `text-space-trim`

## 2.0.3

- Add new properties:
  - `box-shadow-color`
  - `box-shadow-offset`
  - `box-shadow-blur`
  - `box-shadow-spread`
  - `box-shadow-position`

## 2.0.2

- Add new properties:
  - `white-space-collapse`
- Removed unknown properties:
  - `text-space-collapse`

## 2.0.1

- Fix plugin option `false`

## 2.0.0

- Change rule name to `@mrhenry/stylelint-mrhenry-prop-order`

## 1.0.10

- Re-order `border-*` properties (again)

## 1.0.9

- Re-order `border-*` properties
- Group `width` and `*-width` properties
- Group `height` and `*-height` properties
- Add new properties:
  - `border-block-end-radius`
  - `border-block-start-radius`
  - `border-bottom-radius`
  - `border-inline-end-radius`
  - `border-inline-start-radius`
  - `border-left-radius`
  - `border-right-radius`
  - `border-top-radius`
  - `text-autospace`
  - `text-spacing-trim`

## 1.0.8

Add support for `stylelint` `15.0.0`

- Add new properties:
  - `animation-range-start`
  - `animation-range-end`
- Removed unknown properties:
  - `animation-delay-start`
  - `animation-delay-end`

## 1.0.7

- Add new properties:
  - `anchor-default`

## 1.0.6

- Add new properties:
  - `layout-order`
  - `reading-order`

## 1.0.5

- Preserve comments after a declaration.

## 1.0.4

- Add new properties:
  - `link-parameters`
  - `overflow-clip-margin-block`
  - `overflow-clip-margin-block-end`
  - `overflow-clip-margin-block-start`
  - `overflow-clip-margin-bottom`
  - `overflow-clip-margin-inline`
  - `overflow-clip-margin-inline-end`
  - `overflow-clip-margin-inline-start`
  - `overflow-clip-margin-left`
  - `overflow-clip-margin-right`
  - `overflow-clip-margin-top`

## 1.0.3

- Order `inline` before `block`.
- Group `size` properties together with `width` and `height`.
- Group `min-` and `max-` properties together with their respective regular properties.

## 1.0.0

Initial release
