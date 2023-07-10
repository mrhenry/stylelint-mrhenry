const { rule, ruleName } = require("./stylelint-mrhenry-attribute-selector-no-unknown");

testRule({
	plugins: ["./stylelint-mrhenry-attribute-selector-no-unknown.cjs"],
	ruleName,
	config: true,

	accept: [
		{
			code: "div {}",
			description: "Only a type selector"
		},
		{
			code: 'div[data-foo="bar"] {}',
			description: "Has a data prefixed attribute"
		},
		{
			code: 'mr-foo[hidden] {}',
		},
		{
			code: 'mr-foo[data-bar] {}',
		},
		{
			code: 'button[name] {}',
		},
		{
			code: 'button[name]::after {}',
		},
		{
			code: 'button[data-foo] {}',
		},
		{
			code: '[data-foo]button {}',
		},
		{
			code: '[class] {}',
		},
		{
			code: 'a[href] {}',
		},
		{
			code: 'a:focus[href] {}',
		},
		{
			code: '[href]a {}',
		},
		{
			code: '[href][id]a {}',
		},
		{
			code: 'mr-foo[id] {}',
		},
		{
			code: '.foo[id] {}',
		},
		{
			code: ':is([id]) {}',
		},
		{
			code: '[name] {}',
		},
		{
			code: '[href] {}',
		},
		{
			code: "[name] {}",
			description: "Non-global attribute selector",
		},
		{
			code: "[href] {}",
			description: "Non-global attribute selector",
		},
		{
			code: "a [href] {}",
			description: "Non-global attribute selector",
		},
		{
			code: "[href] a {}",
			description: "Non-global attribute selector",
		},
		{
			code: "a::before[href] {}",
			description: "Non-global attribute selector",
		},
	],

	reject: [
		{
			code: "mr-foo[alignment-baseline] {}",
			description: "Non-global attribute selector on a custom element",
			message: rule.messages.expected('alignment-baseline', 'mr-foo'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 25
		},
		{
			code: "mr-foo[bar] {}",
			description: "Attribute selector without 'data-' prefix on a custom element",
			message: rule.messages.expected('bar'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 10
		},
		{
			code: "mr-foo[href] {}",
			description: "Non-global attribute selector on a custom element",
			message: rule.messages.expected('href', 'mr-foo'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 11
		},
		{
			code: "button[href] {}",
			description: "Non-global attribute selector on an unexpected standard element",
			message: rule.messages.expected('href', 'button'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 11
		},
		{
			code: "foo[href] {}",
			description: "Non-global attribute selector on element that doesn't exist",
			message: rule.messages.expected('href', 'foo'),
			line: 1,
			column: 4,
			endLine: 1,
			endColumn: 8
		},
	]
});

testRule({
	plugins: ["./stylelint-mrhenry-attribute-selector-no-unknown.cjs"],
	ruleName,
	config: false,

	accept: [
		{
			code: ".class[does-not-exist] {}",
			description: "Attribute selector does not exist"
		}
	],

	reject: []
});
