// my-plugin.test.js
const { rule, ruleName } = require("./stylelint-mrhenry-prop-order");

testRule({
	plugins: ["./stylelint-mrhenry-prop-order.js"],
	ruleName,
	config: true,
	fix: true,

	accept: [
		{
			code: ".class { margin: 0; margin-left: 10px; }",
			description: "longhand after shorthand"
		},
		{
			code: `.class {
	margin-left: 10px;
	/* a comment */
	margin: 0;
}`,
			description: "shorthand after longhand but separated by a comment"
		},
		{
			code: `.class {
	margin-left: 10px;

	margin: 0;
}`,
			description: "shorthand after longhand but separated by an empty line"
		},
		{
			code: `.class {
	margin-left: 10px;
	
	margin: 0;
}`,
			description: "shorthand after longhand but separated by a line with only whitespace"
		},
	],

	reject: [
		{
			code: ".class { margin-left: 10px; margin: 0; }",
			fixed: ".class { margin: 0; margin-left: 10px; }",
			description: "shorthand after longhand",
			message: rule.messages.expected('margin', 'margin-left'),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 21
		}
	]
});
