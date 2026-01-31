// Client-side Trainings API calls (for CSR)
// Uses Next.js API routes as proxy to backend

import type {
  TrainingsListResponse,
  TrainingDetailResponse,
  TrainingsQueryParams,
} from '@/types/trainings.types'

/**
 * Fetch paginated list of trainings (Client-side via proxy)
 * Used in Client Components with useState/useEffect or React Query
 */
export async function fetchTrainings(
  params: TrainingsQueryParams = {}
): Promise<TrainingsListResponse> {
  const {
    page = 0,
    size = 10,
    sortBy = 'trainingStatus',
    sortDir = 'asc',
    ...filters
  } = params

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir,
  })

  // Add filter params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString())
    }
  })

  const response = await fetch(`/api/trainings?${queryParams}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch trainings: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch single training by ID (Client-side via proxy)
 * Used in Client Components
 */
export async function fetchTrainingById(id: string): Promise<TrainingDetailResponse> {
  const response = await fetch(`/api/trainings/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch training: ${response.statusText}`)
  }

  return response.json()
}
