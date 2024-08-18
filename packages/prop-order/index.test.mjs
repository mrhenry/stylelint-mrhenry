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
			description: "shorthand after longhand (1)",
			message: rule.messages.expected(
				['margin-left', 'margin'],
				['margin', 'margin-left']
			),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 39
		},
		{
			code: "@media screen { margin-left: 10px; margin: 0; }",
			fixed: "@media screen { margin: 0; margin-left: 10px; }",
			description: "shorthand after longhand (2)",
			message: rule.messages.expected(
				['margin-left', 'margin'],
				['margin', 'margin-left']
			),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 46
		},
		{
			code: ".class { margin-left: 5px; margin: 0; margin-bottom: 10px; }",
			fixed: ".class { margin: 0; margin-bottom: 10px; margin-left: 5px; }",
			description: "shorthand after longhand (3)",
			warnings: [
				{
					message: rule.messages.expected(
						['margin-left', 'margin', 'margin-bottom'],
						['margin', 'margin-bottom', 'margin-left'],
					),
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 59
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
			description: "shorthand after longhand (4)",
			message: rule.messages.expected(
				['margin-left', 'margin'],
				['margin', 'margin-left']
			),
			line: 2,
			column: 2,
			endLine: 3,
			endColumn: 12
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
			description: "shorthand after longhand (5)",
			message: rule.messages.expected(
				['margin-left', 'margin'],
				['margin', 'margin-left']
			),
			line: 4,
			column: 2,
			endLine: 5,
			endColumn: 12
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
			description: "shorthand after longhand (5)",
			message: rule.messages.expected(
				['margin-left', 'margin'],
				['margin', 'margin-left']
			),
			line: 3,
			column: 3,
			endLine: 4,
			endColumn: 13
		},
		{
			code: `
.class {
	--c: 0;
	--a: 3;
	--b: 1;
	border-bottom-color: red; /* border-color */
	border: 1px solid green;

	/* section*/
	margin: 0; /* reset */
	margin-left: 10px;
	margin-inline: 5px; /* logical */

	height: 5px; /* size */
	width: 10px;
}
			`,
			fixed: `
.class {
	--c: 0;
	--a: 3;
	--b: 1;
	border: 1px solid green;
	border-bottom-color: red; /* border-color */

	/* section*/
	margin: 0; /* reset */
	margin-inline: 5px; /* logical */
	margin-left: 10px;

	width: 10px;
	height: 5px; /* size */
}
			`,
			description: "shorthand after longhand (7)",
			warnings: [
				{
					message: rule.messages.expected(
						['border-bottom-color', 'border'],
						['border', 'border-bottom-color']
					),
					line: 6,
					column: 2,
					endLine: 7,
					endColumn: 26
				},
				{
					message: rule.messages.expected(
						['margin', 'margin-left', 'margin-inline'],
						['margin', 'margin-inline', 'margin-left']
					),
					line: 10,
					column: 2,
					endLine: 12,
					endColumn: 21
				},
				{
					message: rule.messages.expected(
						['height', 'width'],
						['width', 'height']
					),
					line: 14,
					column: 2,
					endLine: 15,
					endColumn: 14
				},
			]
		},
		{
			code: `.class {
	font-weight: 500;
	font-size: 0.875rem; /* 14px */
	padding-top: 0.8125rem;
	line-height: 0.875rem; /* 14px */
	text-align: left /* align */;
}`,
			fixed: `.class {
	font-size: 0.875rem; /* 14px */
	font-weight: 500;
	line-height: 0.875rem; /* 14px */
	padding-top: 0.8125rem;
	text-align: left /* align */;
}`,
			description: "shorthand after longhand (8)",
			warnings: [
				{
					message: rule.messages.expected(
						['font-weight', 'font-size', 'padding-top', 'line-height', 'text-align'],
						['font-size', 'font-weight', 'line-height', 'padding-top', 'text-align'],
					),
					line: 2,
					column: 2,
					endLine: 6,
					endColumn: 31
				},
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
			description: "shorthand after longhand (9)",
		}
	],

	reject: []
});
