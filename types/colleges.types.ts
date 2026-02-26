// Colleges API Types - Matching backend response structure

import type { Course } from './courses.types'

export enum CollegeType {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  GOVERNMENT = 'GOVERNMENT',
}

export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface College {
  collegeId: number
  slug: string
  collegeName: string
  location: string
  affiliation: string
  website: string
  contact: string
  email: string
  description: string
  establishedYear: string
  collegeType: CollegeType
  priority: Priority
  logoName: string
  latitude: number
  longitude: number
  collegePictureName: string[]
  courses: Course[]
}

export interface CollegesListResponse {
  message: string
  data: {
    content: College[]
    totalElements: number
    totalPages: number
    pageNumber: number
    pageSize: number
    last: boolean
  }
}

export interface CollegeDetailResponse {
  message: string
  data: College
}

export interface CollegesFilters {
  page?: number
  size?: number
  sortBy?: 'collegeName' | 'location' | 'establishedYear'
  sortDir?: 'asc' | 'desc'
  location?: string
  affiliation?: string
  collegeType?: CollegeType
}
