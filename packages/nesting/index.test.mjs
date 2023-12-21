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
			code: "@custom-selector :--foo bar;",
			description: "Regular at rule"
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
		{
			code: "div { &:is(body.theme-red *) { color: red } }",
			description: "Alternative to multiple &, in pseudo functions",
		},
		{
			code: "div { &:is(body.theme-red &) { color: red } }",
			description: "Multiple &, in pseudo functions",
		},
		{
			code: "div { &:is(&&) { color: red } }",
			description: "Multiple &, in pseudo functions",
		},
		{
			code: "div { &:is(& + &) { color: red } }",
			description: "Multiple &, in pseudo functions",
		},
		{
			code: "div { { color: red; } }",
			description: "empty selector",
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
			code: "div { && { color: red } }",
			description: "Multiple & top level",
			message: rule.messages.rejectedMustEndWithPseudo(),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 9
		},
		{
			code: "div { & + & { color: red } }",
			description: "Multiple & top level",
			message: rule.messages.rejectedNestingSelectorIncorrectShape(),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 12
		},
		{
			code: "div { & &:focus { color: red } }",
			description: "Multiple & top level",
			message: rule.messages.rejectedNestingSelectorIncorrectShape(),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 16
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
	plugins: ["./index.mjs"],
	ruleName: rule.ruleName,
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
			code: ".bar { && { color: magenta; } }",
			fixed: ".bar { &:is(&) { color: magenta; } }",
			description: "Must end with pseudo",
			message: rule.messages.rejectedMustEndWithPseudo(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 10
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
		{
			code: ".bar { body.theme-red & { color: magenta; } }",
			fixed: ".bar { &:is(body.theme-red *) { color: magenta; } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedMustStartWithAmpersand(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 24
		},
		{
			code: ".bar { body.theme-red > & { color: magenta; } }",
			fixed: ".bar { &:is(body.theme-red > *) { color: magenta; } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedMustStartWithAmpersand(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 26
		},
		{
			code: ".bar { body.theme-red + & { color: magenta; } }",
			fixed: ".bar { &:is(body.theme-red + *) { color: magenta; } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedMustStartWithAmpersand(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 26
		},
		{
			code: ".bar { body.theme-red ~ & { color: magenta; } }",
			fixed: ".bar { &:is(body.theme-red ~ *) { color: magenta; } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedMustStartWithAmpersand(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 26
		},
		{
			code: ".bar { body.theme-red& { color: magenta; } }",
			fixed: ".bar { &:is(body.theme-red&) { color: magenta; } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedMustStartWithAmpersand(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 23
		},
		{
			code: ".bar { :focus& { color: magenta; } }",
			fixed: ".bar { &:focus { color: magenta; } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedMustStartWithAmpersand(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 15
		},
		{
			code: ".bar { body.theme-red .bar { color: magenta; } }",
			fixed: ".bar { &:is(body.theme-red .bar) { color: magenta; } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedMustStartWithAmpersand(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 27
		},
		{
			code: ".bar { body.theme-red * { color: magenta; } }",
			fixed: ".bar { &:is(body.theme-red *) { color: magenta; } }",
			description: "Incorrect shape",
			message: rule.messages.rejectedMustStartWithAmpersand(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 24
		},
		{
			code: ".bar { > img { color: magenta; } }",
			fixed: ".bar { &:has(> img) { color: magenta; } }",
			description: "Relative selector",
			message: rule.messages.rejectedMustStartWithAmpersand(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 13
		},
		{
			code: ".bar { ~ img { color: magenta; } + img { color: magenta; } }",
			fixed: ".bar { &:has(~ img) { color: magenta; } &:has(+ img) { color: magenta; } }",
			description: "Relative selector",
			warnings: [
				{
					message: rule.messages.rejectedMustStartWithAmpersand(),
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 13
				},
				{
					message: rule.messages.rejectedMustStartWithAmpersand(),
					line: 1,
					column: 34,
					endLine: 1,
					endColumn: 39
				}
			]
		},
		{
			code: ".bar { /* foo */  img { color: magenta; } }",
			fixed: ".bar { /* foo */  &:is(img) { color: magenta; } }",
			description: "Relative selector",
			message: rule.messages.rejectedMustStartWithAmpersand(),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 22
		},
		{
			code: ".bar { & + & { color: magenta; } }",
			fixed: ".bar { &:is(& + &) { color: magenta; } }",
			description: "Relative selector",
			message: rule.messages.rejectedNestingSelectorIncorrectShape(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 13
		},
		{
			code: ".bar { &.foo + & { color: magenta; } }",
			fixed: ".bar { &:is(.foo + &) { color: magenta; } }",
			description: "Relative selector",
			message: rule.messages.rejectedNestingSelectorIncorrectShape(),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 17
		},
		{
			code: ".bar { &.foo, &.bar { color: magenta; } }",
			fixed: ".bar { &:is(.foo),&:is(.bar) { color: magenta; } }",
			description: "Relative selector",
			warnings: [
				{
					message: rule.messages.rejectedMustEndWithPseudo(),
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 20
				},
				{
					message: rule.messages.rejectedMustEndWithPseudo(),
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 20
				}
			]
		},
	]
});

testRule({
	plugins: ["./index.mjs"],
	ruleName: rule.ruleName,
	config: [true, { ignoreAtRules: ['unknown', /^YOUR-/i] }],

	accept: [
		{
			code: "div { @unknown foo; }",
			description: "Ignore unknown at rule by string"
		},
		{
			code: "div { @yOuR-rule foo; }",
			description: "Ignore unknown at rule by regexp"
		},
	],

	reject: [
		{
			code: "div { @not-yOuR-rule foo; }",
			description: "@custom-selector",
			message: rule.messages.rejectedAtRule('not-your-rule'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 20
		},
	]
});

testRule({
	plugins: ["./index.mjs"],
	ruleName: rule.ruleName,
	config: [null],

	accept: [
		{
			code: "div { @unknown foo; }",
			description: "Ignore unknown at rule by string"
		},
		{
			code: "div { @yOuR-rule foo; }",
			description: "Ignore unknown at rule by regexp"
		},
	],

	reject: []
});
