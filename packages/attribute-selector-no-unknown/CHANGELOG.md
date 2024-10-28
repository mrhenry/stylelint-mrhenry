# Changelog

## 2.1.3

- Update dependencies

## 2.1.2

- Remove the `JSDoc` type annotation for the plugin to avoid forwards compat issues with subtle upstream type changes.

## 2.1.1

- Add support for the `writingsuggestions` attribute
- Set minimum Stylelint version to `16.8.2`

## 2.1.0

- Add `globalAttributes` secondary option
- Add `attributesByTagName` secondary option

```js
{
	globalAttributes: ['attr-foo'],
	attributesByTagName: {
		'elem-foo': ['attr-bar', 'attr-baz']
	}
}
```

## 2.0.1

- Add type annotations

## 2.0.0

 - Migrate to `stylelint` `v16.0.0`

## 1.0.4

- Update list of known attributes.

## 1.0.3

- Fix an exception on empty attributes `[]`

## 1.0.2

- Fix list of all now attributes.

## 1.0.1

- Allow lone attribute selectors. e.g `[href]` is allowed.

## 1.0.0

Initial release
