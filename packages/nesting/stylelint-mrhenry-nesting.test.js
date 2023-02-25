// my-plugin.test.js
const { rule, ruleName } = require("./stylelint-mrhenry-nesting");

testRule({
	plugins: ["./stylelint-mrhenry-nesting.js"],
	ruleName,
	config: true,

	accept: [
		{
			code: "div {}",
			description: "Un-nested selector"
		},
		{
			code: "div { @media print { color: green; } }",
			description: "Nested conditional media rule"
		},
		{
			code: "@media print { div { color: green; } }",
			description: "Regular conditional media rule"
		},
		{
			code: "div { @supports (display: grid) { color: green; } }",
			description: "Nested conditional supports rule"
		},
		{
			code: "div { &:focus { color: green; } }",
			description: "Pseudo class selector"
		},
		{
			code: "div { &:not(.foo) { color: green; } }",
			description: "Functional pseudo class selector"
		},
		{
			code: "div { &:not(.foo), &:is(.bar) { color: green; } }",
			description: "Functional pseudo class selector"
		},
	],

	reject: [
		{
			code: "div { > bar { color: red } }",
			description: "Implicit ampersand",
			message: rule.messages.rejectedMustStartWithAmpersand(),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 12
		},
		{
			code: "div { .foo.bar { color: red } }",
			description: "Implicit ampersand",
			message: rule.messages.rejectedMustStartWithAmpersand(),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 15
		},
		{
			code: "div { &:focus, .foo.bar { color: red } }",
			description: "Implicit ampersand",
			message: rule.messages.rejectedMustStartWithAmpersand(),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 24
		},
		{
			code: "div { & { color: red } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedNestingSelectorIncorrectShape(),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 8
		},
		{
			code: "div { &.bar { color: red } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedMustEndWithPseudo(),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 12
		},
		{
			code: "div { & :is(.bar) { color: red } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedNestingSelectorIncorrectShape(),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 18
		},
		{
			code: "div { &:not(&) { color: red } }",
			description: "Multiple &, in pseudo functions",
			message: rule.messages.rejectedMustContainOnlyOneAmpersand(),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 15
		},
		{
			code: "div { & > bar + .bar { color: red } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedNestingSelectorIncorrectShape(),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 21
		},
		{
			code: "div { & > bar + :not(.bar) { color: red } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedNestingSelectorIncorrectShape(),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 27
		},
		{
			code: "div { &:is(.foo) { &:is(.bar) { color: red } } }",
			description: "Nesting depth",
			message: rule.messages.rejectedNestingDepth(),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 30
		},
		{
			code: "div { @layer foo { color: red } }",
			description: "@layer",
			message: rule.messages.rejectedAtRule('layer'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 12
		},
		{
			code: "div { @custom-selector :--foo .bar; }",
			description: "@custom-selector",
			message: rule.messages.rejectedAtRule('custom-selector'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 22
		},
	]
});

testRule({
	plugins: ["./stylelint-mrhenry-nesting.js"],
	ruleName,
	config: true,
	fix: true,

	accept: [],

	reject: [
		{
			code: ".bar { [data-theme=red] { color: magenta; } }",
			fixed: ".bar { &:is([data-theme=red]) { color: magenta; } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedMustStartWithAmpersand(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 24
		},
		{
			code: ".bar { &[data-theme=red] { color: magenta; } }",
			fixed: ".bar { &:is([data-theme=red]) { color: magenta; } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedMustEndWithPseudo(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 25
		},
		{
			code: ".bar { &:hover:focus { color: magenta; } }",
			fixed: ".bar { &:is(:hover:focus) { color: magenta; } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedNestingSelectorIncorrectShape(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 21
		},
		{
			code: ".bar { :hover { color: magenta; } }",
			fixed: ".bar { &:hover { color: magenta; } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedMustStartWithAmpersand(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 14
		},
	]
});
