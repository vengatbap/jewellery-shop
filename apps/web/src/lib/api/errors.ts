export interface ApiError {
  code: string;
  message: string;
  status: number;
  fieldErrors?: Record<string, string[]>;
}

export function normalizeError(error: any): ApiError {
  if (error?.response?.data) {
    const data = error.response.data;
    return {
      code: data.error?.code || data.code || "API_ERROR",
      message: data.error?.message || data.error || data.message || "An unexpected error occurred",
      status: error.response.status || 500,
      fieldErrors: data.fieldErrors || undefined,
    };
  }

  if (error?.message) {
    return {
      code: "NETWORK_ERROR",
      message: error.message,
      status: 0,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "An unknown error occurred",
    status: 500,
  };
}
