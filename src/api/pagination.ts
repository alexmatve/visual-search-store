export interface PaginationQuery {
  offset?: number
  limit?: number
}

export function createPaginationSearchParams(query: PaginationQuery) {
  const params = new URLSearchParams()
  typeof query.offset !== 'undefined' && params.set('offset', query.offset.toString())
  typeof query.limit !== 'undefined' && params.set('limit', query.limit.toString())
  return params
}
