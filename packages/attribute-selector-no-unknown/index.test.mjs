import { testRule } from 'stylelint-test-rule-node';
import plugin from './index.mjs';

const rule = plugin.rule;

testRule({ plugins: ["./index.mjs"], ruleName: rule.ruleName, config: null, accept: [{ code: "", description: "empty rule" }] });

testRule({
	plugins: ["./index.mjs"],
	ruleName: rule.ruleName,
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
			code: '[readonly] {}',
		},
		{
			code: '[selected] {}',
		},
		{
			code: '[] {}',
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
			endColumn: 27
		},
		{
			code: "mr-foo[bar] {}",
			description: "Attribute selector without 'data-' prefix on a custom element",
			message: rule.messages.expected('bar'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 12
		},
		{
			code: ".something,\nmr-foo[bar] {}",
			description: "Attribute selector without 'data-' prefix on a custom element",
			message: rule.messages.expected('bar'),
			line: 2,
			column: 7,
			endLine: 2,
			endColumn: 12
		},
		{
			code: "mr-foo[href] {}",
			description: "Non-global attribute selector on a custom element",
			message: rule.messages.expected('href', 'mr-foo'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 13
		},
		{
			code: "button[href] {}",
			description: "Non-global attribute selector on an unexpected standard element",
			message: rule.messages.expected('href', 'button'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 13
		},
		{
			code: "foo[href] {}",
			description: "Non-global attribute selector on element that doesn't exist",
			message: rule.messages.expected('href', 'foo'),
			line: 1,
			column: 4,
			endLine: 1,
			endColumn: 10
		},
	]
});

testRule({
	plugins: ["./index.mjs"],
	ruleName: rule.ruleName,
	config: [true, {
		globalAttributes: ['attr-foo'],
		attributesByTagName: {
			'elem-foo': ['attr-bar', 'attr-baz'],
			'elem-bar': ['attr-bar-2'],
		}
	}],

	accept: [
		{
			code: '[attr-foo] {}',
		},
		{
			code: 'div[attr-foo] {}',
		},
		{
			code: 'summary[attr-foo] {}',
		},
		{
			code: 'elem-foo[attr-bar] {}',
		},
		{
			code: 'elem-foo[attr-baz] {}',
		},
		{
			code: '[attr-bar] {}',
		},
		{
			code: 'elem-bar[attr-bar-2] {}',
		},
	],

	reject: [
		{
			code: "div[attr-bar] {}",
			description: "Non-global attribute selector with an unexpected tag name",
			message: rule.messages.expected('attr-bar', 'div'),
			line: 1,
			column: 4,
			endLine: 1,
			endColumn: 14
		},
		{
			code: "elem-bar[attr-bar] {}",
			description: "Non-global attribute selector with an unexpected tag name",
			message: rule.messages.expected('attr-bar', 'elem-bar'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 19
		},
	]
});

testRule({
	plugins: ["./index.mjs"],
	ruleName: rule.ruleName,
	config: null,

	accept: [
		{
			code: ".class[does-not-exist] {}",
			description: "Attribute selector does not exist"
		}
	],

	reject: []
});
