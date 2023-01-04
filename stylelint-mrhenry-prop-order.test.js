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
			code: ".class {}",
			description: "empty rule"
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
		{
			code: `.class {
	margin-left: 10px;
	--foo: 0;
	margin: 0;
	--bar: 0;
}`,
			description: "shorthand after longhand but separated by custom properties",
		},
	],

	reject: [
		{
			code: ".class { margin-left: 10px; margin: 0; }",
			fixed: ".class { margin: 0; margin-left: 10px; }",
			description: "shorthand after longhand",
			message: rule.messages.expected('margin'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 35
		},
		{
			code: ".class { margin-left: 5px; margin: 0; margin-bottom: 10px; }",
			fixed: ".class { margin: 0; margin-bottom: 10px; margin-left: 5px; }",
			description: "shorthand after longhand",
			warnings: [
				{
					message: rule.messages.expected('margin'),
					line: 1,
					column: 28,
					endLine: 1,
					endColumn: 34
				},
				{
					message: rule.messages.expected('margin-bottom'),
					line: 1,
					column: 39,
					endLine: 1,
					endColumn: 52
				}
			]
		},
		{
			code: `.class {
	margin-left: 10px;
	margin: 0;
	--foo: 0;
	--bar: 0;
}`,
			fixed: `.class {
	margin: 0;
	margin-left: 10px;
	--foo: 0;
	--bar: 0;
}`,
			description: "shorthand after longhand",
			message: rule.messages.expected('margin'),
			line: 3,
			column: 2,
			endLine: 3,
			endColumn: 8
		},
		{
			code: `.class {
	--foo: 0;
	--bar: 0;
	margin-left: 10px;
	margin: 0;
}`,
			fixed: `.class {
	--foo: 0;
	--bar: 0;
	margin: 0;
	margin-left: 10px;
}`,
			description: "shorthand after longhand",
			message: rule.messages.expected('margin'),
			line: 5,
			column: 2,
			endLine: 5,
			endColumn: 8
		},
		{
			code: `@keyframes FOO {
	0% {
		margin-left: 10px;
		margin: 0;
	}
}`,
			fixed: `@keyframes FOO {
	0% {
		margin: 0;
		margin-left: 10px;
	}
}`,
			description: "shorthand after longhand",
			message: rule.messages.expected('margin'),
			line: 4,
			column: 3,
			endLine: 4,
			endColumn: 9
		},
	]
});
