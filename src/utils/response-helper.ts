export interface SuccessResponse {
  data?: any;
  status: 'success';
  message: string;
  statusCode?: number;
}

export interface ErrorResponse {
  error?: any;
  status: 'error' | 'failure';
  message: string;
  statusCode?: number;
}

class ResponseHelper {
  /**
   * Create a standardized success response
   */
  public success(message: string, data?: any, statusCode = 200): SuccessResponse {
    return {
      data,
      status: 'success',
      message,
      statusCode,
    };
  }

  /**
   * Create a standardized error response
   */
  public error(message: string, error?: any, statusCode = 500): ErrorResponse {
    return {
      error,
      status: 'error',
      message,
      statusCode,
    };
  }

  /**
   * Create a validation error response with field-specific errors
   */
  public validationError(message: string, validationErrors: Record<string, string[]>, statusCode = 400): ErrorResponse {
    return {
      error: validationErrors,
      status: 'failure',
      message,
      statusCode,
    };
  }

  /**
   * Create a bad request error response
   */
  public badRequest(message: string, details?: any): ErrorResponse {
    return {
      error: details,
      status: 'failure',
      message,
      statusCode: 400,
    };
  }

  /**
   * Create an unauthorized error response
   */
  public unauthorized(message: string = 'Unauthorized access'): ErrorResponse {
    return {
      error: null,
      status: 'error',
      message,
      statusCode: 401,
    };
  }

  /**
   * Create a forbidden error response
   */
  public forbidden(message: string = 'Access forbidden'): ErrorResponse {
    return {
      error: null,
      status: 'error',
      message,
      statusCode: 403,
    };
  }

  /**
   * Create a not found error response
   */
  public notFound(message: string = 'Resource not found'): ErrorResponse {
    return {
      error: null,
      status: 'error',
      message,
      statusCode: 404,
    };
  }

  /**
   * Create a conflict error response
   */
  public conflict(message: string, details?: any): ErrorResponse {
    return {
      error: details,
      status: 'error',
      message,
      statusCode: 409,
    };
  }

  /**
   * Create an internal server error response
   */
  public internalError(message: string = 'Internal server error', error?: any): ErrorResponse {
    return {
      error: process.env.NODE_ENV === 'development' ? error : null,
      status: 'error',
      message,
      statusCode: 500,
    };
  }
}

export default new ResponseHelper();
