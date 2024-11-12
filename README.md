# is-dom-exception [![JSR](https://jsr.io/badges/@li/is-dom-exception)](https://jsr.io/@li/is-dom-exception)

A small utility to check if a value (e.g. a thrown error) is a `DOMException` with the given `name`.

## Usage

```ts
import { DOM_EXCEPTION_NAME, isDomException } from '@li/is-dom-exception'

const ac = new AbortController()
ac.abort()
const { reason } = ac.signal

if (isDomException(reason, DOM_EXCEPTION_NAME.AbortError)) {
	// type is now narrowed to `DOMException & { name: 'AbortError' }`
	const exception: DOMException & { name: 'AbortError' } = reason
}
```
