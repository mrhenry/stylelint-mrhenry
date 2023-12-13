import stylelint from 'stylelint';
import selectorParser from 'postcss-selector-parser';

const ruleName = "@mrhenry/stylelint-mrhenry-invalid-of-type-selectors";
const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (name) => {
		return `Expected a type selector with ${name}.`;
	}
});

const meta = {
	url: "https://github.com/mrhenry/stylelint-mrhenry/tree/main/packages/invalid-of-type-selectors"
};

const ofTypeSelectors = [
	':first-of-type',
	':last-of-type',
	':nth-of-type',
	':nth-last-of-type',
];

const ruleFunction = (primaryOption, secondaryOptionObject, context) => {
	return (postcssRoot, postcssResult) => {
		if (!primaryOption) {
			return;
		}
		
		postcssRoot.walkRules((rule) => {
			{
				const lowerCaseSelector = rule.selector.toLowerCase();
				let hasCandidate = false;
				for (const candidate of ofTypeSelectors) {
					if (lowerCaseSelector.includes(candidate)) {
						hasCandidate = true;
						break;
					}
				}

				if (!hasCandidate) {
					return;
				}
			}

			for (const selector of rule.selectors) {
				let hasOfTypeSelector = false;
				let hasTypeSelector = false;

				const selectorAST = selectorParser().astSync(selector);
				selectorAST.walk((node) => {
					if (node.type === 'pseudo' && ofTypeSelectors.includes(node.value.toLowerCase())) {
						hasOfTypeSelector = node.value;
						return;
					}

					if (node.type === 'tag' || node.type === 'universal') {
						hasTypeSelector = true;
						return;
					}
				});

				if (hasOfTypeSelector && !hasTypeSelector) {
					stylelint.utils.report({
						message: messages.expected(hasOfTypeSelector),
						node: rule,
						index: 0,
						endIndex: rule.selector.length,
						result: postcssResult,
						ruleName,
					});
				}
			}
		});
	};
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default stylelint.createPlugin(ruleName, ruleFunction);
