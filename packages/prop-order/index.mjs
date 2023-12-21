import stylelint from 'stylelint';
import { order } from './order.mjs';

const orderSet = new Set(order);

const ruleName = "@mrhenry/stylelint-mrhenry-prop-order";
const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (name) => {
		return `Expected ${name} to appear at a different position.`;
	}
});

const meta = {
	url: "https://github.com/mrhenry/stylelint-mrhenry/tree/main/packages/prop-order",
	fixable: true,
};

const ignoredAtRules = [
	'font-face',
	'property'
];

/** @type {import('stylelint').Rule<true|null>} */
const ruleFunction = (primaryOption, secondaryOption, context) => {
	return (postcssRoot, postcssResult) => {
		const validPrimary = stylelint.utils.validateOptions(postcssResult, ruleName, {
			actual: primaryOption,
			possible: [true]
		});

		/* c8 ignore next */
		if (!validPrimary) return;
		
		postcssRoot.walk((container) => {
			if (container.type !== 'atrule' && container.type !== 'rule') {
				return;
			}

			if (!container.nodes?.length) {
				return;
			}

			let parent = container;
			while (parent) {
				if (parent.type === 'atrule' && ignoredAtRules.includes(parent.name.toLowerCase())) {
					return;
				}

				parent = parent.parent;
			}

			/* c8 ignore next */
			// Comments after a node, not one a new line should be kept together with that node.
			// color: red; /* my color */
			let matchedComments = new Map();
			container.each((node) => {
				if (node.type === 'comment' && !node.raws?.before?.match(/\n/g)) {
					const comment = node;
					const prev = comment.prev();

					if (prev) {
						matchedComments.set(comment, prev);
						comment.remove();
					}
				}
			});

			let declarationsSections = [[]];
			container.each((node) => {
				if (
					node.type === 'decl' &&
					!node.variable &&
					orderSet.has(node.prop.toLowerCase())
				) {
					if ((node.raws?.before?.match(/\n/g) || []).length >= 2) {
						declarationsSections.push([]);
					}

					declarationsSections.at(-1).push(node);

					return;
				}

				declarationsSections.push([]);
			});

			declarationsSections = declarationsSections.filter((x) => {
				return x.length > 1;
			});

			declarationsSections.forEach((section) => {
				section.sort((a, b) => {
					return order.indexOf(a.prop.toLowerCase()) - order.indexOf(b.prop.toLowerCase());
				});

				const firstNodeIndex = Math.min.apply(Math, section.map((x) => container.index(x)));
				const originalFirstNode = container.nodes[firstNodeIndex];

				section.forEach((decl, index) => {
					const desiredIndex = firstNodeIndex + index;
					if (container.index(decl) === desiredIndex) {
						return;
					}

					if (context.fix) {
						container.insertBefore(desiredIndex, decl);
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

				const finalFirstNode = container.nodes[firstNodeIndex];
				if (originalFirstNode.raws.before && finalFirstNode.raws.before) {
					const originalRawBefore = originalFirstNode.raws.before;
					originalFirstNode.raws.before = finalFirstNode.raws.before;
					finalFirstNode.raws.before = originalRawBefore;
				}
			});

			if (context.fix) {
				for (const [comment, prev] of matchedComments) {
					container.insertAfter(prev, comment);
				}
			}
		});
	};
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default stylelint.createPlugin(ruleName, ruleFunction);
