const stylelint = require("stylelint");
const order = require('./order.js');
const orderSet = new Set(order);

const ruleName = "plugin/stylelint-mrhenry-prop-order";
const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (name) => {
		return `Expected ${name} to appear at a different position.`;
	}
});

const meta = {
	url: "https://github.com/mrhenry/stylelint-mrhenry-prop-order"
};

const ruleFunction = (primaryOption, secondaryOptionObject, context) => {
	return (postcssRoot, postcssResult) => {
		postcssRoot.walkRules((rule) => {
			let parent = rule.parent;
			while (parent) {
				if (parent.type === 'atrule' && parent.name.toLowerCase() === 'font-face') {
					return;
				}

				parent = parent.parent
			}

			if (!rule.nodes.length) {
				return;
			}

			let declarationsSections = [[]]
			for (let i = 0; i < rule.nodes.length; i++) {
				if (
					rule.nodes[i].type === 'decl' &&
					!rule.nodes[i].variable &&
					orderSet.has(rule.nodes[i].prop.toLowerCase()) &&
					(rule.nodes[i].raws?.before?.match(/\n/g) || []).length < 2
				) {
					declarationsSections.at(-1).push(rule.nodes[i]);

					continue;
				}

				declarationsSections.push([])
			}

			declarationsSections = declarationsSections.filter((x) => {
				return x.length > 1
			})

			declarationsSections.forEach((section) => {
				section.sort((a, b) => {
					return order.indexOf(a.prop.toLowerCase()) - order.indexOf(b.prop.toLowerCase());
				});

				const firstNodeIndex = Math.min.apply(Math, section.map((x) => rule.index(x)));

				section.forEach((decl, index) => {
					const desiredIndex = firstNodeIndex + index;
					if (rule.index(decl) === desiredIndex) {
						return;
					}

					if (context.fix) {
						rule.insertBefore(desiredIndex, decl)

						return;
					}

					if (index < section.length - 1) {
						stylelint.utils.report({
							message: messages.expected(decl.prop),
							node: decl,
							index: 0,
							endIndex: decl.prop.length,
							result: postcssResult,
							ruleName,
						});
					}
				});
			});
		});
	};
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
