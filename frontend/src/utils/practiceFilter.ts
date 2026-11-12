export type PracticeFilterStatus = 'ALL' | 'UNMASTERED' | 'MASTERED'

export interface PracticeFilterFetchResult<T> {
  data: T
  resolvedFilter: PracticeFilterStatus
  switchedFromUnmasteredToAll: boolean
}

export function normalizePracticeFilterStatus(value: string | null): PracticeFilterStatus {
  if (value === 'ALL' || value === 'MASTERED' || value === 'UNMASTERED') {
    return value
  }
  return 'UNMASTERED'
}

export function buildUpdatedFilterSearchParams(
  currentParams: URLSearchParams,
  nextFilter: PracticeFilterStatus
): URLSearchParams {
  const next = new URLSearchParams(currentParams)
  next.set('filterStatus', nextFilter)
  return next
}

/**
 * Fetches practice data with the requested filter and transparently retries with
 * 'ALL' when 'UNMASTERED' yields 0 items (e.g., right after finishing all unmastered words).
 */
export async function fetchPracticeItemsWithFallback<T>(
  requestedFilter: PracticeFilterStatus,
  fetcher: (filterStatus: PracticeFilterStatus) => Promise<T>,
  isEmpty: (data: T) => boolean
): Promise<PracticeFilterFetchResult<T>> {
  const initialData = await fetcher(requestedFilter)
  if (!isEmpty(initialData) || requestedFilter !== 'UNMASTERED') {
    return {
      data: initialData,
      resolvedFilter: requestedFilter,
      switchedFromUnmasteredToAll: false,
    }
  }

  const allData = await fetcher('ALL')
  if (!isEmpty(allData)) {
    return {
      data: allData,
      resolvedFilter: 'ALL',
      switchedFromUnmasteredToAll: true,
    }
  }

  return {
    data: initialData,
    resolvedFilter: requestedFilter,
    switchedFromUnmasteredToAll: false,
  }
}

