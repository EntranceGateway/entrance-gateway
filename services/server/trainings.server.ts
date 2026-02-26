// Server-side Trainings API calls (for SSR)

import { apiClient } from '../api/client'
import type {
  TrainingsListResponse,
  TrainingDetailResponse,
  TrainingsQueryParams,
} from '@/types/trainings.types'

/**
 * Fetch paginated list of trainings (Server-side)
 * Used in Server Components for SSR
 */
export async function getTrainings(
  params: TrainingsQueryParams = {}
): Promise<TrainingsListResponse> {
  const {
    page = 0,
    size = 10,
    sortBy = 'trainingStatus',
    sortDir = 'asc',
    ...filters
  } = params

  return apiClient<TrainingsListResponse>('/api/v1/trainings', {
    params: {
      page,
      size,
      sortBy,
      sortDir,
      ...filters,
    },
    cache: 'no-store',
  })
}

/**
 * Fetch single training by ID or slug (Server-side)
 * Used in Server Components for SSR
 */
export async function getTrainingById(identifier: string): Promise<TrainingDetailResponse> {
  const isSlug = /[a-z-]/.test(identifier)
  const endpoint = isSlug ? `/api/v1/trainings/slug/${identifier}` : `/api/v1/trainings/${identifier}`
  
  return apiClient<TrainingDetailResponse>(endpoint, {
    cache: 'no-store',
  })
}
