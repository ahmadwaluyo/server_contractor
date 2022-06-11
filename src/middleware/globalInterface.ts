interface BaseResponse<T> {
  statusCode: number;
  message: string;
  payload: T
}
export default BaseResponse;