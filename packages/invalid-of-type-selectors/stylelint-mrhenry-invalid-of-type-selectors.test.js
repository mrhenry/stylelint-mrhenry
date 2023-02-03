// my-plugin.test.js
const { rule, ruleName } = require("./stylelint-mrhenry-invalid-of-type-selectors");

testRule({
	plugins: ["./stylelint-mrhenry-invalid-of-type-selectors.js"],
	ruleName,
	config: true,

	accept: [
		{
			code: "div {}",
			description: "Only a type selector"
		},
		{
			code: "div:first-of-type {}",
			description: "Has a type selector"
		},
		{
			code: "div .bar:first-of-type {}",
			description: "Has a type selector"
		},
		{
			code: "*:first-of-type {}",
			description: "Has a type selector"
		}
	],

	reject: [
		{
			code: ".class:first-of-type {}",
			description: "Does not have a type selector",
			message: rule.messages.expected(':first-of-type'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 21
		},
		{
			code: ".class:last-of-type {}",
			description: "Does not have a type selector",
			message: rule.messages.expected(':last-of-type'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 20
		},
	]
});
