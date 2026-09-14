import css from '@webref/css';
import { definitionSyntax } from 'css-tree';

import { order } from './order.mjs';

const existingProperties = new Set(order);
const properties = new Set();

const constituentPropertiesGraph = [];
const shorthands = new Map();
const logicalPropertyGroups = new Map();

const listedProperties = (await css.listAll()).properties;

for (const property of listedProperties) {
	if (property.name.startsWith('-webkit-')) {
		continue;
	}

	if (property.name.startsWith('-moz-')) {
		continue;
	}

	if (property.name.startsWith('-ms-')) {
		continue;
	}

	if (property.name.startsWith('-o-')) {
		continue;
	}

	if (property.name.startsWith('tbd-') || property.name.includes('-tbd-') || property.name.endsWith('-tbd')) {
		continue;
	}

	properties.add(property.name);

	if (property.logicalPropertyGroup) {
		const group = logicalPropertyGroups.get(property.logicalPropertyGroup) ?? new Set();
		group.add(property.name);
		logicalPropertyGroups.set(property.logicalPropertyGroup, group);
	}

	if (property.longhands?.length) {
		property.longhands.forEach((x) => {
			constituentPropertiesGraph.push([x, property.name])
		})
	}

	if (property.resetLonghands?.length) {
		property.resetLonghands.forEach((x) => {
			constituentPropertiesGraph.push([x, property.name])
		})
	}

	if (property.longhands?.length || property.resetLonghands?.length) {
		let list = shorthands.get(property.name) ?? new Set();

		if (property.longhands?.length) {
			property.longhands.forEach((x) => list.add(x));
		}

		if (property.resetLonghands?.length) {
			property.resetLonghands.forEach((x) => list.add(x));
		}

		// https://github.com/mdn/content/pull/45683
		if (property.name === 'animation') {
			list.add('animation-range-end');
			list.add('animation-range-start');
			list.add('animation-delay-end');
			list.add('animation-composition');
			list.add('animation-trigger');
		} else if (property.name === 'background') {
			list.add('background-blend-mode');
		} else if (property.name === 'border') {
			list.add('border-image-outset');
			list.add('border-image-repeat');
			list.add('border-image-slice');
			list.add('border-image-source');
			list.add('border-image-width');
		} else if (property.name === 'font') {
			list.add('font-feature-settings');
			list.add('font-kerning');
			list.add('font-language-override');
			list.add('font-optical-sizing');
			list.add('font-size-adjust');
			list.add('font-variant-alternates');
			list.add('font-variant-caps');
			list.add('font-variant-east-asian');
			list.add('font-variant-emoji');
			list.add('font-variant-ligatures');
			list.add('font-variant-numeric');
			list.add('font-variant-position');
			list.add('font-variation-settings');
		} else if (property.name === 'mask') {
			list.add('mask-border-mode');
			list.add('mask-border-outset');
			list.add('mask-border-repeat');
			list.add('mask-border-slice');
			list.add('mask-border-source');
			list.add('mask-border-width');
		}

		shorthands.set(property.name, list);
	}

	if (property.logicalPropertyGroup) {
		let list = shorthands.get(property.logicalPropertyGroup) ?? new Set();

		list.add(property.name);

		shorthands.set(property.logicalPropertyGroup, list);
	}
}

{
	const propertyNames = Array.from(properties);
	propertyNames.sort((a, b) => a.localeCompare(b));

	let hasMissingProperties;
	for (let i = 0; i < propertyNames.length; i++) {
		const property = propertyNames[i];
		if (existingProperties.has(property)) {
			continue;
		}

		console.warn(`missing property : "${property}"`);
		hasMissingProperties = true;
	}

	if (hasMissingProperties) {
		process.exit(1);
	}
}

{
	const existingPropertyNames = Array.from(existingProperties);
	existingPropertyNames.sort((a, b) => a.localeCompare(b));

	let hasUnknownProperties;
	for (let i = 0; i < existingPropertyNames.length; i++) {
		const property = existingPropertyNames[i];
		if (properties.has(property)) {
			continue;
		}

		console.warn(`unknown property : "${property}"`);
		hasUnknownProperties = true;
	}

	if (hasUnknownProperties) {
		process.exit(1);
	}
}

{
	let hasIncorrectShorthandOrders;
	for (let i = 0; i < order.length; i++) {
		const longhandsForShorthand = shorthands.get(order[i]);
		if (!longhandsForShorthand) {
			continue;
		}

		for (const longhandForShorthand of longhandsForShorthand) {
			const longhandIndex = order.findIndex((x) => x === longhandForShorthand);

			if (i > longhandIndex) {
				console.warn(`property ordered before a corresponding shorthand : "${longhandForShorthand}" must come after "${order[i]}"`);
				hasIncorrectShorthandOrders = true;
			}
		}
	}

	if (hasIncorrectShorthandOrders) {
		process.exit(1);
	}
}
