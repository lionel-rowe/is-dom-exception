import { assert } from '@std/assert'
import { DOM_EXCEPTION_NAME, isDomException } from './mod.ts'
import { deadline } from '@std/async'

Deno.test(isDomException.name, async (t) => {
	await t.step('TimeoutError', async () => {
		try {
			await deadline(new Promise((_) => {}), 0)
		} catch (e) {
			assert(isDomException(e, 'TimeoutError'))
		}
	})
	await t.step('TimeoutError (with enum)', async () => {
		try {
			await deadline(new Promise((_) => {}), 0)
		} catch (e) {
			assert(isDomException(e, DOM_EXCEPTION_NAME.TimeoutError))
		}
	})
	await t.step('AbortError', () => {
		const ac = new AbortController()
		ac.abort()

		assert(isDomException(ac.signal.reason, 'AbortError'))
	})
	await t.step('AbortError (with enum)', () => {
		const ac = new AbortController()
		ac.abort()

		assert(isDomException(ac.signal.reason, DOM_EXCEPTION_NAME.AbortError))
	})
	await t.step('narrows type', () => {
		const ac = new AbortController()
		ac.abort()
		const { reason } = ac.signal

		if (isDomException(reason, DOM_EXCEPTION_NAME.AbortError)) {
			const _: DOMException & { name: 'AbortError' } = reason
		}
	})
})
