export function isString(value) {
	return typeof value === 'string' || value instanceof String;
}

export function isRecordOfStringArrays(value) {
	if (!value) return false;
	if (typeof value !== 'object') return false;
	if (Array.isArray(value)) return false;

	for (const key in value) {
		if (Object.hasOwnProperty.call(value, key)) {
			/* c8 ignore next */
			if (!isString(key)) return false;

			if (!value[key]) return false;
			if (!Array.isArray(value[key])) return false;

			for (const attr of value[key]) {
				if (!isString(attr)) return false;
			}
		}
	}

	return true;
}
