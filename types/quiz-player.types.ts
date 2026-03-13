// Quiz Player Types — matches GET /api/v1/questions/set/{questionSetId} response

export interface QuizOption {
  optionId: number
  optionText: string
  optionImageUrl: string | null
  optionOrder: number
  correct: boolean
}

export interface QuizQuestion {
  questionId: number
  question: string
  marks: number
  categoryId: number
  categoryName: string
  questionSetId: number
  questionSetTitle: string
  mcqImage: string | null
  options: QuizOption[]
}

export interface QuestionSetResponse {
  message: string
  data: Record<string, QuizQuestion[]>
}
