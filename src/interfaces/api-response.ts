export interface ApiFieldError {
  field: string;
  message: string;
  code: string;
}

export interface ApiSuccessResponse<T> {
  status: 'success';
  message: string;
  code: string;
  data: T;
}

export interface ApiErrorResponse {
  status: 'error';
  message: string;
  code: string;
  field?: string;
  errors?: ApiFieldError[];
}
