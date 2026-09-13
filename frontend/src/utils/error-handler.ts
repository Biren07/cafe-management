import { AxiosError } from 'axios';

export function extractErrorMessage(error: unknown): string {
  if (!error) return 'An unknown error occurred.';

  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
  }

  if (typeof error === 'object' && error !== null) {
    const errObj = error as Record<string, unknown>;
    if ('data' in errObj && typeof errObj.data === 'object' && errObj.data !== null) {
      const dataObj = errObj.data as Record<string, unknown>;
      if (typeof dataObj.message === 'string') {
        return dataObj.message;
      }
    }
    if (typeof errObj.message === 'string') {
      return errObj.message;
    }
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred. Please try again.';
}
