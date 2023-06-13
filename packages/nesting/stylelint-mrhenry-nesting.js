const stylelint = require("stylelint");
const selectorParser = require('postcss-selector-parser');

const ruleName = "@mrhenry/stylelint-mrhenry-nesting";
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
	rejectedNestingDepth: () => {
		return `Nested rules must be limited to 1 level deep.`;
	},
	rejectedNestingSelectorIncorrectShape: () => {
		return `Nested selectors must be compound selectors, starting with "&" and followed by a single pseudo selector.`;
	},
});

const meta = {
	url: "https://github.com/mrhenry/stylelint-mrhenry/tree/main/packages/nesting",
	fixable: true,
};

const ruleFunction = (primaryOption, secondaryOptionObject, context) => {
	return (postcssRoot, postcssResult) => {
		if (!primaryOption) {
			return;
		}
		
		const ignoreAtRulesOptions = secondaryOptionObject?.ignoreAtRules ?? [];

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

			for (const ignoreAtRulesOption of ignoreAtRulesOptions) {
				if (ignoreAtRulesOption instanceof RegExp) {
					if (ignoreAtRulesOption.test(name)) {
						// ignored by regexp match
						return;
					}
				} else {
					if (name === ignoreAtRulesOption) {
						// ignored by direct match
						return;
					}
				}
			}

			let rulesDepth = 0;
			let parent = atrule.parent;
			while (parent) {
				if (parent.type === 'rule') {
					rulesDepth++;
				}

				parent = parent.parent;
			}

			if (rulesDepth === 0) {
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
			const firstCompoundOrSelf = getFirstCompoundOrSelf(selectorsAST);

			isRelativeSelector = false;
			if (firstCompoundOrSelf.nodes[0]?.type === 'combinator') {
				isRelativeSelector = true;
			}

			for (let i = 0; i < selectorsAST.nodes.length; i++) {
				const selectorAST = selectorsAST.nodes[i];
				if (!selectorAST.nodes || !selectorAST.nodes.length) {
					continue;
				}

				let nestingCounter = 0;
				{
					selectorAST.walkNesting(() => {
						nestingCounter++;
					});
				}

				// .foo { .bar & {} }
				if (
					context.fix &&
					nestingCounter === 1 &&
					selectorAST.nodes[selectorAST.nodes.length - 1]?.type === 'nesting' &&
					selectorAST.nodes[selectorAST.nodes.length - 2]?.type === 'combinator'
				) {
					fixSelector_AncestorPattern(rule, selectorsAST, selectorAST);
					continue;
				}

				// .foo { :focus& {} }
				if (
					context.fix &&
					selectorAST.nodes.length === 2 &&
					selectorAST.nodes[0]?.type === 'pseudo' &&
					selectorParser.isPseudoClass(selectorAST.nodes[0]) &&
					selectorAST.nodes[1]?.type === 'nesting'
				) {
					const a = selectorAST.nodes[0];
					const b = selectorAST.nodes[1];

					selectorAST.replaceWith(selectorParser.selector({
						nodes: [
							b,
							a,
						]
					}))
					rule.selector = selectorsAST.toString();
					continue;
				}

				// .foo { .bar {} }
				if (selectorAST.nodes[0]?.type !== 'nesting') {
					if (context.fix) {
						fixSelector(rule, selectorsAST, selectorAST);
						continue;
					}

					stylelint.utils.report({
						message: messages.rejectedMustStartWithAmpersand(),
						node: rule,
						index: 0,
						endIndex: rule.selector.length,
						result: postcssResult,
						ruleName,
					});

					continue;
				}

				// .foo { & + .bar {} }
				if (selectorAST.nodes.length !== 2) {
					if (context.fix) {

						const firstPart = selectorAST.nodes[0];
						const afterFirstPart = selectorAST.nodes[0]?.next();

						if (firstPart && afterFirstPart?.type === 'combinator') {
							selectorAST.nodes[0]?.replaceWith(selectorParser.universal())
							fixSelector(rule, selectorsAST, selectorAST);
						} else {
							selectorAST.nodes[0]?.remove();
							fixSelector(rule, selectorsAST, selectorAST);
						}
						
						continue;
					}

					stylelint.utils.report({
						message: messages.rejectedNestingSelectorIncorrectShape(),
						node: rule,
						index: 0,
						endIndex: rule.selector.length,
						result: postcssResult,
						ruleName,
					});

					continue;
				}

				// .foo { &.bar {} }
				if (selectorAST.nodes[1]?.type !== 'pseudo') {
					if (context.fix) {
						selectorAST.nodes[0]?.remove();
						fixSelector(rule, selectorsAST, selectorAST);
						continue;
					}

					stylelint.utils.report({
						message: messages.rejectedMustEndWithPseudo(),
						node: rule,
						index: 0,
						endIndex: rule.selector.length,
						result: postcssResult,
						ruleName,
					});

					continue;
				}
			}
		});
	};
};

function fixSelector(rule, selectorsAST, selectorAST) {
	if (
		selectorAST.nodes.length === 1 &&
		selectorAST.nodes[0].type === 'pseudo'
	) {
		selectorAST.replaceWith(selectorParser.selector({
			nodes: [
				selectorParser.nesting(),
				selectorAST.nodes[0]
			]
		}))

		rule.selector = selectorsAST.toString();
		return;
	}

	selectorAST.replaceWith(selectorParser.selector({
		nodes: [
			selectorParser.nesting(),
			selectorParser.pseudo({
				value: isRelativeSelector ? ':has' : ':is',
				nodes: [
					selectorAST
				]
			}),
		]
	}))

	rule.selector = selectorsAST.toString();
}

function fixSelector_AncestorPattern(rule, selectorsAST, selectorAST) {
	selectorAST.nodes[selectorAST.nodes.length - 1].replaceWith(selectorParser.universal());
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

function getFirstCompoundOrSelf(x) {
	if (!x.nodes) {
		return x;
	}

	for (let i = 0; i < x.nodes.length; i++) {
		if (x.nodes[i].type !== 'selector') {
			return x;
		}
	}

	return x.nodes[0];
}
