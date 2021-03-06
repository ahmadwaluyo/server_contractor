export default function ResponseStatus<T>(statusCode: number, message: string, data: T[] | T): any {
  return {
    status: statusCode,
    message,
    data
  }
}