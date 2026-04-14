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
}
