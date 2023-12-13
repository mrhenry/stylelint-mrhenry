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

testRule({
	plugins: ["./index.mjs"],
	ruleName: rule.ruleName,
	config: false,

	accept: [
		{
			code: ".class:last-of-type {}",
			description: "Only a type selector"
		}
	],

	reject: []
});
