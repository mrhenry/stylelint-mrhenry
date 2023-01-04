import css from '@webref/css';
import fs from 'fs/promises';

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

		properties.add(property.name);
	}
}

const propertyNames = Array.from(properties);
propertyNames.sort((a, b) => a.localeCompare(b));

await fs.writeFile('./order.mjs', `module.exports = ${JSON.stringify(propertyNames, null, '\t')}`)
