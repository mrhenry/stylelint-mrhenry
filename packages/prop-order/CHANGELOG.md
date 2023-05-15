# Changelog

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
