// Abbreviated example
const stylelint = require("stylelint");
const order = require('./order.mjs');

const ruleName = "plugin/stylelint-mrhenry-prop-order";
const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (shouldBeFirst, shouldBeSecond) => {
		return `Expected ${shouldBeFirst} to appear before ${shouldBeSecond}`;
	}
});

const meta = {
	url: "https://github.com/mrhenry/stylelint-mrhenry-prop-order"
};

const ruleFunction = (primaryOption, secondaryOptionObject, context) => {
	return (postcssRoot, postcssResult) => {
		postcssRoot.walkRules((rule) => {
			if (!rule.nodes || !rule.nodes.length) {
				return;
			}

			let decl;
			for (let i = 0; i < rule.nodes.length; i++) {
				if (rule.nodes[i].type === 'decl' && !rule.nodes[i].variable) {
					decl = rule.nodes[i];
					break;
				}
			}

			if (!decl) {
				return;
			}

			while (decl) {
				const next = decl.next();
				if (!next) {
					break;
				}

				if (
					next.type === 'decl' &&
					!next.variable && 
					!((next.raws?.before?.match(/\n/g) || []).length >= 2)
				) {
					const declPropIndex = order.indexOf(decl.prop.toLowerCase());
					const nextPropIndex = order.indexOf(next.prop.toLowerCase());
					if (declPropIndex === -1 || nextPropIndex === -1) {
						decl = next;
						continue;
					}

					if (declPropIndex <= nextPropIndex) {
						decl = next;
						continue;
					}

					if (context.fix) {
						next.after(decl);

						decl = next;
						continue;
					}

					stylelint.utils.report({
						message: messages.expected(next.prop, decl.prop),
						node: decl,
						index: 0,
						endIndex: decl.prop.length,
						result: postcssResult,
						ruleName,
					});

					decl = next;
					continue;
				}

				
				let currentIndex = rule.index(next);
				for (let i = currentIndex; i < rule.nodes.length; i++) {
					if (rule.nodes[i].type === 'decl' && !rule.nodes[i].variable) {
						decl = rule.nodes[i];
						break;
					}
				}

				if (!decl) {
					return;
				}
			}

		});
	};
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
