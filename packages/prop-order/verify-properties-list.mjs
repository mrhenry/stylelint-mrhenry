import css from '@webref/css';
import * as order from './order.cjs';

const existingProperties = new Set(order.default);
const properties = new Set();

const parsedFiles = await css.listAll();
for (const [shortname, data] of Object.entries(parsedFiles)) {
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
