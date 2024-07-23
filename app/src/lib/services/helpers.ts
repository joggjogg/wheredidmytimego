import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(
  error: unknown,
): error is { message: string } {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  )
}

export function errorToMessage(
  err: FetchBaseQueryError | SerializedError | undefined,
): string | undefined {
  if (isFetchBaseQueryError(err)) {
    // you can access all properties of `FetchBaseQueryError` here
    const errMsg = 'error' in err ? err.error : JSON.stringify(err.data)
    if (err.status == 404) return 'Resource not found'
    return errMsg
  } else if (isErrorWithMessage(err)) {
    // you can access a string 'message' property here
    return err.message
  }
}
