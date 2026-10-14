/**
 * Convert an Axios error into { message, fieldErrors, status }.
 * Laravel 422 responses look like: { message, errors: { field: ["msg", ...] } }
 */
export function parseApiError(err) {
  if (err?.response) {
    const { status, data } = err.response;

    if (status === 422) {
      const fieldErrors = {};
      Object.entries(data?.errors || {}).forEach(([field, msgs]) => {
        fieldErrors[field] = Array.isArray(msgs) ? msgs[0] : String(msgs);
      });
      return { status, fieldErrors, message: 'Please correct the highlighted fields.' };
    }
    if (status === 404) {
      return { status, fieldErrors: {}, message: data?.message || 'The requested record was not found.' };
    }
    return {
      status,
      fieldErrors: {},
      message: data?.message ? `Server error: ${data.message}` : `The server returned an error (HTTP ${status}).`,
    };
  }

  if (err?.code === 'ECONNABORTED') {
    return { status: 0, fieldErrors: {}, message: 'The request timed out. Please try again.' };
  }
  if (err?.request) {
    return {
      status: 0,
      fieldErrors: {},
      message: 'Cannot reach the server. Check that the API is running and your connection is working.',
    };
  }
  return { status: 0, fieldErrors: {}, message: err?.message || 'Something went wrong.' };
}
