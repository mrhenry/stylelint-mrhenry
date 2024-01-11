import stylelint from 'stylelint';
import selectorParser from 'postcss-selector-parser';
import { data } from './data.mjs';
import { isRecordOfStringArrays, isString } from './validate-options.mjs';

const ruleName = "@mrhenry/stylelint-mrhenry-attribute-selector-no-unknown";
const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (attribute, tag) => {
		if (tag) {
			return `Unexpected attribute selector "${attribute}" in "${tag}".`;
		}

		return `Unexpected attribute selector "${attribute}".`;
	}
});

const meta = {
	url: "https://github.com/mrhenry/stylelint-mrhenry/tree/main/packages/attribute-selector-no-unknown"
};

/** @type {import('stylelint').Rule<true|null>} */
const ruleFunction = (primaryOption, secondaryOption, context) => {
	return (postcssRoot, postcssResult) => {
		const validPrimary = stylelint.utils.validateOptions(postcssResult, ruleName, {
			actual: primaryOption,
			possible: [true]
		});

		/* c8 ignore next */
		if (!validPrimary) return;

		const validSecondary = stylelint.utils.validateOptions(postcssResult, ruleName, {
			actual: secondaryOption,
			possible: {
				globalAttributes: [isString],
				attributesByTagName: isRecordOfStringArrays,
			},
			optional: true,
		});

		/* c8 ignore next */
		if (!validSecondary) return;

		const userData = {
			/** @type {Set<string>} */
			globalAttributes: new Set(secondaryOption?.globalAttributes ?? []),
			/** @type {Map<string, string[]>} */
			attributesByTagName: new Map(Object.entries(secondaryOption?.attributesByTagName ?? {})),
			/** @type {Set<string>} */
			allAttributes: new Set(secondaryOption?.globalAttributes ?? []),
		}

		for (const attributes of userData.attributesByTagName.values()) {
			for (const attribute of attributes) {
				userData.allAttributes.add(attribute);
			}
		}

		postcssRoot.walkRules((rule) => {
			if (!rule.selector.includes('[')) {
				return;
			}
		
			const selectorAST = selectorParser().astSync(rule.selector);
			selectorAST.walkAttributes((node) => {
				if (!node.attribute) {
					return;
				}

				const attribute = node.attribute;

				// "data-" prefixed attributes are user defined and always allowed.
				if (attribute.startsWith('data-')) return;

				// Global attributes are always allowed.
				if (data.globalAttributes.has(attribute)) return;
				if (userData.globalAttributes.has(attribute)) return;

				if (
					!data.allAttributes.has(attribute) &&
					!userData.allAttributes.has(attribute)
				) {
					// An unknown attribute that doesn't start with "data-" is always invalid.
					stylelint.utils.report({
						message: messages.expected,
						messageArgs: [attribute],
						node: rule,
						index: node.sourceIndex,
						endIndex: node.sourceIndex + attribute.length,
						result: postcssResult,
						ruleName,
					});

					return;
				}

				const tagName = findTagNameInCompound(node);
				if (!tagName) {
					// Without a tagname we assume that any attribute is allowed.
					return;
				}

				const attributesByTagName = data.attributesByTagName.get(tagName);
				if (attributesByTagName && attributesByTagName.includes(attribute)) return;

				const userAttributesByTagName = userData.attributesByTagName.get(tagName);
				if (userAttributesByTagName && userAttributesByTagName.includes(attribute)) return;

				// If the tag name is a standard element
				// we assume that only attributes that are valid for that tag are allowed.
				stylelint.utils.report({
					message: messages.expected,
					messageArgs: [attribute, tagName],
					node: rule,
					index: node.sourceIndex,
					endIndex: node.sourceIndex + attribute.length,
					result: postcssResult,
					ruleName,
				});
			});
		});
	};
};

function findTagNameInCompound(node) {
	let next = node.next();
	while (next) {
		if (next.type === 'combinator') {
			break;
		}

		if (selectorParser.isPseudoElement(next)) {
			break;
		}

		if (next.type === 'tag') {
			return next.value;
		}

		next = next.next();
	}

	let prev = node.prev();
	while (prev) {
		if (prev.type === 'combinator') {
			break;
		}

		if (selectorParser.isPseudoElement(prev)) {
			break;
		}

		if (prev.type === 'tag') {
			return prev.value;
		}

		prev = prev.prev();
	}
}

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default stylelint.createPlugin(ruleName, ruleFunction);
