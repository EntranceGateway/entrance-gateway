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
 * Fetch single training by ID (Server-side)
 * Used in Server Components for SSR
 */
export async function getTrainingById(id: string): Promise<TrainingDetailResponse> {
  return apiClient<TrainingDetailResponse>(`/api/v1/trainings/${id}`, {
    cache: 'no-store',
  })
}
