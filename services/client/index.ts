export { fetchNotes, fetchNoteById, fetchNotesByFilters } from './notes.client'
export { fetchCourses, fetchCourseById } from './courses.client'
export { fetchSyllabusById } from './syllabus.client'
export { fetchTrainings, fetchTrainingById } from './trainings.client'
export {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  refreshAccessToken,
  storeAuthTokens,
  getAuthTokens,
  clearAuthTokens,
  isAuthenticated,
  isTokenExpired,
  refreshTokenIfNeeded,
  getValidAccessToken,
  shouldRotateRefreshToken,
  getRedirectAfterLogin,
  clearRedirectAfterLogin,
  storePendingEmail,
  getPendingEmail,
  clearPendingEmail,
} from './auth.client'
