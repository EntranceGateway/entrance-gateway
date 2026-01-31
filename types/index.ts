export type {
  Note,
  NotesListResponse,
  NoteDetailResponse,
  NotesQueryParams,
  ApiErrorResponse,
} from './notes.types'

export type {
  Course,
  CoursesListResponse,
  CourseDetailResponse,
  CoursesQueryParams,
} from './courses.types'

export { CourseLevel, CourseType, Affiliation } from './courses.types'

export type {
  Syllabus,
  SyllabusDetailResponse,
} from './syllabus.types'

export type {
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  LoginRequest,
  LoginResponse,
  AuthTokens,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './auth.types'

export type {
  Training,
  TrainingsListResponse,
  TrainingDetailResponse,
  TrainingsQueryParams,
} from './trainings.types'
