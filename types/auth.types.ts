// Auth API Types

export interface RegisterRequest {
  fullname: string
  email: string
  contact: string
  address: string
  dob: string // YYYY-MM-DD format
  interested: string
  latestQualification: string
  password: string
}

export interface RegisterResponse {
  message: string
  data?: {
    email: string
    userId?: number
  }
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface VerifyOtpResponse {
  message: string
  data?: {
    verified: boolean
  }
}

export interface ResendOtpRequest {
  email: string
}

export interface ResendOtpResponse {
  message: string
  data?: {
    email: string
  }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  data: {
    userId: number
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  message: string
  data: {
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
  }
}
