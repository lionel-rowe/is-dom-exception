/**
 * @module
 * A small utility to check if a value (e.g. a thrown error) is a `DOMException` with the given `name`.
 */

/**
 * Check if a value is a `DOMException` with the given name.
 *
 * @param x Value to check
 * @param name A `DOMException` name to check against
 * @returns Whether `x` is a `DOMException` with the given name
 */
export function isDomException<T extends DomExceptionName | undefined>(
	x: unknown,
	name?: T,
): x is DOMException & { name: T extends undefined ? string : T } {
	// @ts-ignore - for forward-compat/enhancement. No-op if `Error.isError` is not available in current env.
	if (Error.isError?.(x) === false) return false
	if (Object.prototype.toString.call(x) !== '[object DOMException]') return false
	if (name && (x as DOMException).name !== name) return false
	return true
}

/**
 * Possible values for a `DOMException`'s `name` property.
 *
 * @see {@linkcode DOM_EXCEPTION_NAME} for a description of each exception name.
 */
export type DomExceptionName = typeof DOM_EXCEPTION_NAME[keyof typeof DOM_EXCEPTION_NAME]

/**
 * `DOMException` error name values (deprecated values are omitted as they shouldn't be relied upon).
 * @see {@link https://webidl.spec.whatwg.org/#idl-DOMException-error-names | Base DOMException error names} in the Web IDL spec.
 */
export const DOM_EXCEPTION_NAME = {
	/** The operation would yield an incorrect node tree. [DOM] */
	HierarchyRequestError: 'HierarchyRequestError',
	/** The object is in the wrong document. [DOM] */
	WrongDocumentError: 'WrongDocumentError',
	/** The string contains invalid characters. */
	InvalidCharacterError: 'InvalidCharacterError',
	/** The object can not be modified. */
	NoModificationAllowedError: 'NoModificationAllowedError',
	/** The object can not be found here. */
	NotFoundError: 'NotFoundError',
	/** The operation is not supported. */
	NotSupportedError: 'NotSupportedError',
	/** The attribute is in use by another element. [DOM] */
	InUseAttributeError: 'InUseAttributeError',
	/** The object is in an invalid state. */
	InvalidStateError: 'InvalidStateError',
	/** The string did not match the expected pattern. */
	SyntaxError: 'SyntaxError',
	/** The object can not be modified in this way. */
	InvalidModificationError: 'InvalidModificationError',
	/** The operation is not allowed by Namespaces in XML. [XML-NAMES] */
	NamespaceError: 'NamespaceError',
	/** The operation is insecure. */
	SecurityError: 'SecurityError',
	/** A network error occurred. */
	NetworkError: 'NetworkError',
	/** The operation was aborted. */
	AbortError: 'AbortError',
	/** The quota has been exceeded. */
	QuotaExceededError: 'QuotaExceededError',
	/** The operation timed out. */
	TimeoutError: 'TimeoutError',
	/** The supplied node is incorrect or has an incorrect ancestor for this operation. [DOM] */
	InvalidNodeTypeError: 'InvalidNodeTypeError',
	/** The object can not be cloned. */
	DataCloneError: 'DataCloneError',
	/** The encoding operation (either encoded or decoding) failed. */
	EncodingError: 'EncodingError',
	/** The I/O read operation failed. */
	NotReadableError: 'NotReadableError',
	/** The operation failed for an unknown transient reason (e.g. out of memory).*/
	UnknownError: 'UnknownError',
	/** A mutation operation in a transaction failed because a constraint was not satisfied. [INDEXEDDB]*/
	ConstraintError: 'ConstraintError',
	/** Provided data is inadequate. */
	DataError: 'DataError',
	/** A request was placed against a transaction which is currently not active, or which is finished. [INDEXEDDB] */
	TransactionInactiveError: 'TransactionInactiveError',
	/** The mutating operation was attempted in a "readonly" transaction. [INDEXEDDB] */
	ReadOnlyError: 'ReadOnlyError',
	/** An attempt was made to open a database using a lower version than the existing version. [INDEXEDDB] */
	VersionError: 'VersionError',
	/** The operation failed for an operation-specific reason. */
	OperationError: 'OperationError',
	/** The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.*/
	NotAllowedError: 'NotAllowedError',
	/** The user opted out of the process. */
	OptOutError: 'OptOutError',
} as const
