import css from '@webref/css';
import { definitionSyntax } from 'css-tree';

import { order } from './order.mjs';

const existingProperties = new Set(order);
const properties = new Set();

const constituentPropertiesGraph = [];
const logicalPropertyGroups = new Map();

const parsedFiles = await css.listAll();
const entries = Array.from(Object.entries(parsedFiles));

entries.sort((a, b) => {
	const name_a = a[0].replace(/-\d+$/, '');
	const name_b = b[0].replace(/-\d+$/, '');

	if (name_a !== name_b) {
		return name_a.localeCompare(name_b);
	}

	const level_a = parseInt((a[0].match(/-(\d+)$/) ?? [])[1] ?? '0', 10);
	const level_b = parseInt((b[0].match(/-(\d+)$/) ?? [])[1] ?? '0', 10);

	return level_a - level_b;
});

for (const [, data] of entries) {
	for (const property of data.properties) {
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

		if (property.value || property.newValues) {
			const ast = definitionSyntax.parse(property.value || property.newValues);
			definitionSyntax.walk(ast, {
				enter(node) {
					if (node.type === 'Property') {
						constituentPropertiesGraph.push([node.name, property.name]);
					}
				}
			});
		}
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
	for (let i = 0; i < constituentPropertiesGraph.length; i++) {
		const [a, b] = constituentPropertiesGraph[i];

		for (const [groupName, group] of logicalPropertyGroups) {
			if (group.has(a) && group.has(b)) {
				const removed = constituentPropertiesGraph.splice(i, 1);
				i--;
			}
		}
	}

	for (let i = 0; i < order.length; i++) {
		const thisProp = constituentPropertiesGraph.find((x) => x[0] === order[i]);
		if (!thisProp) {
			continue;
		}

		const shorthand = order.findIndex((x) => x === thisProp[1]);

		if (i < shorthand) {
			console.warn(`property ordered before a corresponding shorthand : "${thisProp[0]}" must come after "${thisProp[1]}"`);
		}
	}
}
