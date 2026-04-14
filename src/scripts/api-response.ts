import type { ApiSuccessResponse } from '@/interfaces/api-response';

export function successResponse<T>(
  message: string,
  code: string,
  data: T,
): ApiSuccessResponse<T> {
  return {
    status: 'success',
    message,
    code,
    data,
  };
}
