export class ApiResponse<T = unknown> {
  constructor(public readonly data: T | T[], public readonly meta = {}) {}
}
