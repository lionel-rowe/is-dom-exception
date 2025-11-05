// @ts-types="@types/jsdom"
import { JSDOM } from 'jsdom'
import { assert, assertRejects } from '@std/assert'
import { DOM_EXCEPTION_NAME, type DomExceptionName, isDomException } from './mod.ts'
import { stubProperty } from '@std/testing/unstable-stub-property'

const throwingTests: { name: DomExceptionName; test(): void | Promise<void> }[] = [
	{
		name: 'AbortError',
		test: () => AbortSignal.abort().throwIfAborted(),
	},
	{
		name: 'TimeoutError',
		test: () =>
			new Promise((_, rej) =>
				AbortSignal.timeout(0).addEventListener('abort', function () {
					rej(this.reason)
				})
			),
	},
	{
		name: 'DataCloneError',
		test: () => void structuredClone(Symbol()),
	},
	{
		name: 'InvalidCharacterError',
		test: () => void atob('!'),
	},
]

Deno.test(isDomException.name, async (t) => {
	await t.step('basic', () => {
		assert(isDomException(new DOMException()))
	})
	for (const { test, name } of throwingTests) {
		await t.step(name, async () => {
			const err = await assertRejects(async () => await test())
			if (!isDomException(err)) throw err
			assert(isDomException(err, name))
			assert(isDomException(err, DOM_EXCEPTION_NAME[name]))
			assert(!isDomException(err, 'IndexSizeError'))
		})
	}
	await t.step('narrows type', () => {
		const reason: unknown = {}

		if (isDomException(reason, DOM_EXCEPTION_NAME.AbortError)) {
			const _1: DOMException & { name: 'AbortError' } = reason
			// @ts-expect-error name
			const _2: DOMException & { name: 'DataCloneError' } = reason
		}

		if (isDomException(reason, 'AbortError', 'TimeoutError')) {
			const _1: DOMException & { name: 'AbortError' | 'TimeoutError' } = reason
			// @ts-expect-error name
			const _3: DOMException & { name: 'DataCloneError' } = reason
		}
	})
	await t.step('doesn’t narrow `name` prop type if no `name` arg is supplied', () => {
		const reason: unknown = {}

		if (isDomException(reason)) {
			const _1: DOMException = reason
			// @ts-expect-error name
			const _2: DOMException & { name: 'AbortError' } = reason
		}
	})
	await t.step('`false` for non-Error', () => {
		assert(!isDomException(null))
		assert(!isDomException(undefined))
		assert(!isDomException(0))
		assert(!isDomException(1n))
		assert(!isDomException(''))
		assert(!isDomException(false))
		assert(!isDomException(Symbol()))
		assert(!isDomException({}))
		assert(!isDomException([]))
		assert(!isDomException(() => {}))
	})
	await t.step('`false` for non-DOMException Error', () => {
		assert(!isDomException(new Error('foo')))
	})
	await t.step('`false` for fake DOMException class that doesn’t inherit from real `DOMException`', () => {
		assert(
			!isDomException(
				new (class DOMException extends Error {
					[Symbol.toStringTag] = 'DOMException'
				})(),
			),
		)
	})
	await t.step('`true` for DOMException subclass', () => {
		assert(isDomException(
			new (class Subclass extends DOMException {
				[Symbol.toStringTag] = 'Subclass'
			})(),
		))
	})
	await t.step('with patched global `DOMException` from JSDOM', () => {
		const jsdom = new JSDOM('')
		const OriginalDomException = globalThis.DOMException

		{
			using _ = stubProperty(globalThis, 'DOMException', jsdom.window.DOMException)
			assert(!isDomException(new OriginalDomException()))
			assert(isDomException(new jsdom.window.DOMException()))
		}

		assert(isDomException(new OriginalDomException()))
		assert(!isDomException(new jsdom.window.DOMException()))
	})
})
