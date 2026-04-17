export interface QuizTemplateConfig {
  totalQuestions: number
  totalMarks: number
  durationMinutes: number
  topicDistribution: Record<string, unknown>[] // Omitted detailed typing for brevity unless needed
  difficultyDistribution: Record<string, number>
  enableNegativeMarking: boolean
  negativeMarkValue: number
  constraints: {
    noRepeatWithinDays: number
    avoidPreviouslyFailed: boolean
    maxUsageCount: number
  }
}

export interface QuizTemplate {
  templateId: string
  name: string
  description: string
  type: 'PRACTICE' | 'COMPETITIVE'
  entryFee: number
  config: QuizTemplateConfig
  status: string
  createdAt: string
  updatedAt: string
  createdById: number
  createdByName: string
  // Added optional fallback for mapping legacy mock types if necessary
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
