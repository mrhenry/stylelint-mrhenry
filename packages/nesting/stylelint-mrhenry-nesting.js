const stylelint = require("stylelint");
const selectorParser = require('postcss-selector-parser');

const ruleName = "plugin/stylelint-mrhenry-nesting";
const messages = stylelint.utils.ruleMessages(ruleName, {
	rejectedAtRule: (name) => {
		return `Nested at-rules with name "${name}" is not allowed.`;
	},
	rejectedMustStartWithAmpersand: () => {
		return `Nested selectors must start with "&".`;
	},
	rejectedMustEndWithPseudo: () => {
		return `Nested selectors must end with a pseudo selectors.`;
	},
	rejectedMustContainOnlyOneAmpersand: () => {
		return `Nested selectors must only contain a single "&".`;
	},
	rejectedNestingDepth: () => {
		return `Nested rules must be limited to 1 level deep.`;
	},
	rejectedNestingSelectorIncorrectShape: () => {
		return `Nested selectors must be compound selectors, starting with "&" and followed by a single pseudo selector.`;
	},
});

const meta = {
	url: "https://github.com/mrhenry/stylelint-mrhenry/tree/main/packages/nesting"
};

const ruleFunction = (primaryOption, secondaryOptionObject, context) => {
	return (postcssRoot, postcssResult) => {
		postcssRoot.walkAtRules((atrule) => {
			let name = atrule.name.toLowerCase();
			if (
				name === 'media' ||
				name === 'supports' ||
				name === 'container' ||
				name === 'scope'
			) {
				// always allowed
				return;
			}

			stylelint.utils.report({
				message: messages.rejectedAtRule(name),
				node: atrule,
				index: 0,
				endIndex: atrule.name.length,
				result: postcssResult,
				ruleName,
			});
		});

		postcssRoot.walkRules((rule) => {
			{
				let rulesDepth = 1;
				let parent = rule.parent;
				while (parent) {
					if (parent.type === 'rule') {
						rulesDepth++;
					}

					parent = parent.parent;
				}

				if (rulesDepth === 1) {
					return;
				}

				if (rulesDepth > 2) {
					stylelint.utils.report({
						message: messages.rejectedNestingDepth(),
						node: rule,
						index: 0,
						endIndex: rule.selector.length,
						result: postcssResult,
						ruleName,
					});
				}
			}

			const selectorsAST = selectorParser().astSync(rule.selector);

			for (let i = 0; i < selectorsAST.nodes.length; i++) {
				const selectorAST = selectorsAST.nodes[i];

				let nestingCounter = 0;
				{
					let nestingCounter = 0;
					selectorAST.walkNesting(() => {
						nestingCounter++;
					});

					if (nestingCounter > 1) {
						stylelint.utils.report({
							message: messages.rejectedMustContainOnlyOneAmpersand(),
							node: rule,
							index: 0,
							endIndex: rule.selector.length,
							result: postcssResult,
							ruleName,
						});

						return;
					}
				}

				if (selectorAST.nodes?.[0]?.type !== 'nesting') {
					if (context.fix && nestingCounter === 0) {
						fixSelector(rule, selectorsAST, selectorAST);
						return;
					}

					stylelint.utils.report({
						message: messages.rejectedMustStartWithAmpersand(),
						node: rule,
						index: 0,
						endIndex: rule.selector.length,
						result: postcssResult,
						ruleName,
					});

					return;
				}

				if (selectorAST.nodes?.length !== 2) {
					if (context.fix) {
						selectorAST.nodes?.[0]?.remove();
						fixSelector(rule, selectorsAST, selectorAST);
						return;
					}

					stylelint.utils.report({
						message: messages.rejectedNestingSelectorIncorrectShape(),
						node: rule,
						index: 0,
						endIndex: rule.selector.length,
						result: postcssResult,
						ruleName,
					});

					return;
				}

				if (selectorAST.nodes?.[1]?.type !== 'pseudo') {
					if (context.fix) {
						selectorAST.nodes?.[0]?.remove();
						fixSelector(rule, selectorsAST, selectorAST);
						return;
					}

					stylelint.utils.report({
						message: messages.rejectedMustEndWithPseudo(),
						node: rule,
						index: 0,
						endIndex: rule.selector.length,
						result: postcssResult,
						ruleName,
					});

					return;
				}
			}
		});
	};
};

function fixSelector(rule, selectorsAST, selectorAST) {
	selectorAST.replaceWith(selectorParser.selector({
		nodes: [
			selectorParser.nesting(),
			selectorParser.pseudo({
				value: ':is',
				nodes: [
					selectorAST
				]
			}),
		]
	}))
	rule.selector = selectorsAST.toString();
}

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
