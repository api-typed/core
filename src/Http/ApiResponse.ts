export class ApiResponse<T = unknown> {
  constructor(public readonly data: T, public readonly meta = {}) {}
}
