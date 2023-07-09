import { ariaAttributes } from 'aria-attributes'
import { svgElementAttributes } from 'svg-element-attributes'
import { htmlElementAttributes } from 'html-element-attributes'
import fs from 'fs'
import path from 'path'

const htmlElements = new Set(Object.keys(htmlElementAttributes))
const svgElements = new Set(Object.keys(svgElementAttributes))

const allElements = new Set([
	...htmlElements,
	...svgElements,
]);

const htmlAttributes = new Set();
for (const element of htmlElements) {
	if (!htmlElementAttributes[element] || !htmlElementAttributes[element].length) continue;

	htmlAttributes.add(...(htmlElementAttributes[element].filter(x => !!x)));
}

const svgAttributes = new Set();
for (const element of svgElements) {
	if (!svgElementAttributes[element] || !svgElementAttributes[element].length) continue;

	svgAttributes.add(...(svgElementAttributes[element].filter(x => !!x)));
}

const globalAttributes = Array.from(new Set([
	...ariaAttributes,
	...(htmlElementAttributes['*'] ?? []),
	...(svgElementAttributes['*'] ?? []),
]));

globalAttributes.sort((a, b) => a.localeCompare(b));

const attributesByTagName = [];

for (const element of allElements) {
	if (element === '*') continue;

	const values = Array.from(new Set([
		...(htmlElementAttributes[element] ?? []),
		...(svgElementAttributes[element] ?? []),
	])).filter(x => !globalAttributes.includes(x));
	values.sort((a, b) => a.localeCompare(b));

	attributesByTagName.push([element, values]);
}

const allAttributes = Array.from(new Set([
	...htmlAttributes,
	...svgAttributes,
	...ariaAttributes,
]));
allAttributes.sort((a, b) => a.localeCompare(b));

const allElementsArray = Array.from(allElements);
allElementsArray.sort((a, b) => a.localeCompare(b));

fs.writeFileSync(
	path.join('data.cjs'),
	`
// This file is generated by build.mjs
module.exports = {
	globalAttributes: new Set(${JSON.stringify(globalAttributes)}),
	allAttributes: new Set(${JSON.stringify(allAttributes)}),
	attributesByTagName: new Map(${JSON.stringify(attributesByTagName)}),
};
`
);