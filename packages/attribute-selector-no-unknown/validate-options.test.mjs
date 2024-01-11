import test from "node:test";
import assert from "node:assert/strict";
import { isRecordOfStringArrays } from "./validate-options.mjs";

test("isRecordOfStringArrays", async (t) => {
	await t.test("`null` is not a valid option", () => {
		assert.ok(!isRecordOfStringArrays(null));
	});

	await t.test("`undefined` is not a valid option", () => {
		assert.ok(!isRecordOfStringArrays(undefined));
	});

	await t.test("`true` is not a valid option", () => {
		assert.ok(!isRecordOfStringArrays(true));
	});

	await t.test("`false` is not a valid option", () => {
		assert.ok(!isRecordOfStringArrays(true));
	});

	await t.test("A string is not a valid option", () => {
		assert.ok(!isRecordOfStringArrays('foo'));
	});

	await t.test("An array is not a valid option", () => {
		assert.ok(!isRecordOfStringArrays([]));
	});

	await t.test("An empty object is a valid option", () => {
		assert.ok(isRecordOfStringArrays({}));
	});

	await t.test("Element value of `false` is invalid", () => {
		assert.ok(!isRecordOfStringArrays({
			'x-foo': false,
		}));
	});

	await t.test("Element value of `true` is invalid", () => {
		assert.ok(!isRecordOfStringArrays({
			'x-foo': true,
		}));
	});

	await t.test("Element value of `null` is invalid", () => {
		assert.ok(!isRecordOfStringArrays({
			'x-foo': null,
		}));
	});

	await t.test("Element value of `{}` is invalid", () => {
		assert.ok(!isRecordOfStringArrays({
			'x-foo': {},
		}));
	});

	await t.test("Element key of `false` is invalid", () => {
		assert.ok(!isRecordOfStringArrays({
			[false]: {},
		}));
	});

	await t.test("Element key of `true` is invalid", () => {
		assert.ok(!isRecordOfStringArrays({
			[true]: {},
		}));
	});

	await t.test("Element key of `null` is invalid", () => {
		assert.ok(!isRecordOfStringArrays({
			[null]: {},
		}));
	});

	await t.test("Element key of `{}` is invalid", () => {
		assert.ok(!isRecordOfStringArrays({
			[{}]: {},
		}));
	});

	await t.test("An object with an empty array is valid", () => {
		assert.ok(isRecordOfStringArrays({
			'x-foo': [],
		}));
	});

	await t.test("false", () => {
		assert.ok(!isRecordOfStringArrays({
			'x-foo': [
				false,
			],
		}));
	});

	await t.test("string / string", () => {
		assert.ok(isRecordOfStringArrays({
			'x-foo': [
				'attr-bar'
			],
		}));
	});

	await t.test("mixed", () => {
		assert.ok(isRecordOfStringArrays({
			'x-foo': [
				'attr-bar',
				new String('attr-bar'),
			],
			[new String('x-foo')]: [
				'attr-bar',
				new String('attr-bar'),
			],
		}));
	});
});
