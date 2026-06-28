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
