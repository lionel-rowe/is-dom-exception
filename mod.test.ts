import { assert } from '@std/assert'
import { stub } from '@std/testing/mock'
import { errorIsError } from '@li/error-is-error-polyfill'
import { DOM_EXCEPTION_NAME, type DomExceptionName, isDomException } from './mod.ts'

const throwingTests: { name: DomExceptionName; test: () => unknown }[] = [
	{
		name: 'AbortError',
		test: () => {
			const ac = new AbortController()
			ac.abort()
			throw ac.signal.reason
		},
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
		test: () => structuredClone({ fn: () => {} }),
	},
	{
		name: 'InvalidCharacterError',
		test: () => atob('!'),
	},
]

Deno.test(isDomException.name, async (t) => {
	await t.step('basic', () => {
		assert(isDomException(new DOMException()))
	})
	for (const { test, name } of throwingTests) {
		await t.step(name, async () => {
			try {
				await test()
				throw new Error('Expected test to throw')
			} catch (e) {
				if (!isDomException(e)) throw e
				assert(isDomException(e, name))
				assert(isDomException(e, DOM_EXCEPTION_NAME[name]))
			}
		})
	}
	await t.step('narrows type', () => {
		const reason: unknown = {}

		if (isDomException(reason, DOM_EXCEPTION_NAME.AbortError)) {
			const _1: DOMException & { name: 'AbortError' } = reason
			// @ts-expect-error name
			const _2: DOMException & { name: 'DataCloneError' } = reason
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
	await t.step('with Error.isError polyfill', () => {
		// @ts-ignore polyfill
		using _ = stub(Error, 'isError', errorIsError)

		try {
			atob('!')
		} catch (e) {
			assert(isDomException(e, 'InvalidCharacterError'))
		}

		assert(!isDomException({}))
		assert(!isDomException(new Error('foo')))
	})
})
