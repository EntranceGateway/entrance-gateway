export type QuizTemplateStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type QuizTemplateType = 'PRACTICE' | 'COMPETITIVE'

export interface EntranceTypeSummary {
  entranceTypeId: number
  entranceName: string
  slug: string
}

export interface TopicDistribution {
  topicId?: string
  topicName?: string
  count: number
  weightage: number
}

export interface QuizTemplateConfig {
  totalQuestions: number
  totalMarks: number
  durationMinutes: number
  topicDistribution?: TopicDistribution[]
  difficultyDistribution?: Record<string, number>
  enableNegativeMarking: boolean
  negativeMarkValue: number
  constraints?: {
    noRepeatWithinDays?: number
    avoidPreviouslyFailed?: boolean
    maxUsageCount?: number
  }
}

export interface QuizTemplate {
  templateId: string
  name: string
  description?: string
  type: QuizTemplateType
  entryFee: number
  config: QuizTemplateConfig
  status: QuizTemplateStatus
  createdAt: string
  updatedAt: string
  createdById?: number
  createdByName?: string
  createdBy?: string
  entranceType?: EntranceTypeSummary
  // Optional fallback for mapping legacy mock/backend fields if necessary
  difficulty?: string
}

export interface QuizTemplateListResponse {
  message: string
  data: {
    content: QuizTemplate[]
    totalElements: number
    totalPages: number
    pageNumber: number
    pageSize: number
    last: boolean
  }
}

export interface QuizAttemptGeneratedData {
  attemptId: number
  user: {
    userId: number
    email: string
  }
  quizTemplate: QuizTemplate
  questionsSnapshotJson: string
  score: number
  isSubmitted: boolean
  attemptedAt: string
}

export interface GenerateAttemptResponse {
  message: string
  data: QuizAttemptGeneratedData
}

export interface TemplateDetailResponse {
  message: string
  data: QuizTemplate
}

export interface Topic {
  topicId: string
  topicName: string
  description?: string
  categoryName?: string
}

export interface EntranceType {
  entranceTypeId: number
  entranceName: string
  slug: string
  description?: string
}

export interface CustomTopicDistribution {
  topicId: string
  count: number
  weightage: number
}

export interface CustomQuizPayload {
  totalQuestions: number
  totalMarks: number
  durationMinutes: number
  topicDistribution: CustomTopicDistribution[]
  difficultyDistribution?: Record<string, number>
  enableNegativeMarking?: boolean
  negativeMarkValue?: number
  constraints?: {
    noRepeatWithinDays?: number
    avoidPreviouslyFailed?: boolean
    maxUsageCount?: number
  }
}

export interface CreateQuizTemplateRequest {
  name: string
  description?: string
  type: QuizTemplateType
  entryFee: number
  status: QuizTemplateStatus
  entranceTypeId?: number
  config: QuizTemplateConfig
}

export interface CreateQuizTemplateResponse {
  message: string
  data: QuizTemplate[] | QuizTemplate
}
