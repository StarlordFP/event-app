export function success<T>(data: T): { data: T } {
  return { data };
}

export function paginated<T>(
  data: T[],
  meta: { page: number; limit: number; total: number; totalPages: number }
): { events: T[]; pagination: typeof meta } {
  return { events: data, pagination: meta };
}
