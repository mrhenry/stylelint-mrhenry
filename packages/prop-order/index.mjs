import stylelint from 'stylelint';
import { order } from './order.mjs';

const orderSet = new Set(order);

const ruleName = "@mrhenry/stylelint-mrhenry-prop-order";
const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (names, orderedNames) => {
		return `Expected ${names.join(', ')} to appear in ${orderedNames.join(', ')} order.`;
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

const ruleFunction = (primaryOption) => {
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

			// Comments after a node, not on a new line should be kept together with that node.
			// color: red; /* my color */
			let matchedComments = new Map();
			container.each((node) => {
				if (node.type === 'comment' && !node.raws?.before?.match(/\n/g)) {
					const comment = node;
					const prev = comment.prev();

					if (prev) {
						matchedComments.set(comment, prev);
					}
				}
			});

			/** @type {Array<Array<import('postcss').Node>>} */
			let declarationsSections = [[]];
			container.each((node) => {
				if (matchedComments.has(node)) {
					return;
				}

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
				const sortedSection = [...section];
				sortedSection.sort((a, b) => {
					return order.indexOf(a.prop.toLowerCase()) - order.indexOf(b.prop.toLowerCase());
				});

				const firstNodeIndex = Math.min.apply(Math, section.map((x) => container.index(x)));
				const originalFirstNode = container.nodes[firstNodeIndex];

				const sectionPropNames = section.map((decl) => decl.prop);
				const sortedSectionPropNames = sortedSection.map((decl) => decl.prop);

				/** @type {import('postcss').Node} */
				const firstDecl = section.at(0);
				/** @type {import('postcss').Node} */
				const lastDecl = section.at(-1);

				const containerStartOffset = container.source?.start.offset;
				const index = firstDecl.source?.start.offset - containerStartOffset;
				const endIndex = lastDecl.source?.end.offset - containerStartOffset;

				for (let i = 0; i < sectionPropNames.length; i++) {
					const original = sectionPropNames[i];
					const sorted = sortedSectionPropNames[i];

					if (original === sorted) {
						continue;
					}

					stylelint.utils.report({
						message: messages.expected(sectionPropNames, sortedSectionPropNames),
						node: container,
						index,
						endIndex,
						result: postcssResult,
						ruleName,
						fix: {
							apply: () => {
								sortedSection.reverse().forEach((decl) => {
									container.insertBefore(firstNodeIndex, decl);
									return;
								});

								const finalFirstNode = container.nodes[firstNodeIndex];
								if (originalFirstNode.raws.before && finalFirstNode.raws.before) {
									const originalRawBefore = originalFirstNode.raws.before;
									originalFirstNode.raws.before = finalFirstNode.raws.before;
									finalFirstNode.raws.before = originalRawBefore;
								}

								for (const [comment, prev] of matchedComments) {
									if (!section.includes(prev)) {
										continue;
									}

									comment.remove();
									container.insertAfter(prev, comment);
								}
							},
							node: container
						}
					});

					break;
				}
			});
		});
	};
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default stylelint.createPlugin(ruleName, ruleFunction);
