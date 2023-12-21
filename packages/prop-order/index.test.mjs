import { testRule } from 'stylelint-test-rule-node';
import plugin from './index.mjs';

const rule = plugin.rule;

testRule({ plugins: ["./index.mjs"], ruleName: rule.ruleName, config: null, accept: [{ code: "", description: "empty rule" }] });

testRule({
	plugins: ["./index.mjs"],
	ruleName: rule.ruleName,
	config: true,
	fix: true,

	accept: [
		{
			code: ".class { margin: 0; margin-left: 10px; }",
			description: "longhand after shorthand"
		},
		{
			code: "@media screen { margin {} padding {} }",
		},
		{
			code: "@import 'foo.css';",
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
		{
			code: `@font-face {
	margin-left: 10px;
	margin: 0;
}`,
			description: "shorthand after longhand in ignored at-rule",
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
			code: "@media screen { margin-left: 10px; margin: 0; }",
			fixed: "@media screen { margin: 0; margin-left: 10px; }",
			description: "shorthand after longhand",
			message: rule.messages.expected('margin'),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 42
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
		{
			code: `
.class {
	--c: 0;
	--a: 3;
	--b: 1;
	border-bottom-color: red;
	border: 1px solid green;

	/* section*/
	margin: 0;
	margin-left: 10px;
	margin-inline: 5px;

	height: 5px;
	width: 10px;
}
			`,
			fixed: `
.class {
	--c: 0;
	--a: 3;
	--b: 1;
	border: 1px solid green;
	border-bottom-color: red;

	/* section*/
	margin: 0;
	margin-inline: 5px;
	margin-left: 10px;

	width: 10px;
	height: 5px;
}
			`,
			description: "shorthand after longhand",
			warnings: [
				{
					message: rule.messages.expected('border'),
					line: 7,
					column: 2,
					endLine: 7,
					endColumn: 8
				},
				{
					message: rule.messages.expected('margin-inline'),
					line: 12,
					column: 2,
					endLine: 12,
					endColumn: 15
				},
				{
					message: rule.messages.expected('width'),
					line: 15,
					column: 2,
					endLine: 15,
					endColumn: 7
				}
			]
		},
		{
			code: `.class {
	font-weight: 500;
	font-size: 0.875rem; /* 14px */
	padding-top: 0.8125rem;
	line-height: 0.875rem; /* 14px */
	text-align: left;
}`,
			fixed: `.class {
	font-size: 0.875rem; /* 14px */
	font-weight: 500;
	line-height: 0.875rem; /* 14px */
	padding-top: 0.8125rem;
	text-align: left;
}`,
			description: "shorthand after longhand",
			warnings: [
				{
					message: rule.messages.expected('font-size'),
					line: 3,
					column: 2,
					endLine: 3,
					endColumn: 11
				},
				{
					message: rule.messages.expected('font-weight'),
					line: 2,
					column: 2,
					endLine: 2,
					endColumn: 13
				},
				{
					message: rule.messages.expected('line-height'),
					line: 5,
					column: 2,
					endLine: 5,
					endColumn: 13
				},
				{
					message: rule.messages.expected('padding-top'),
					line: 4,
					column: 2,
					endLine: 4,
					endColumn: 13
				}
			]
		},
	]
});

testRule({
	plugins: ["./index.mjs"],
	ruleName: rule.ruleName,
	config: null,

	accept: [
		{
			code: ".class { margin-left: 10px; margin: 0; }",
			description: "shorthand after longhand",
		}
	],

	reject: []
});
