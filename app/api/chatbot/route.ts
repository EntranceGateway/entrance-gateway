import { NextRequest, NextResponse } from 'next/server'

interface ChatbotRequest {
  message: string
  conversationHistory?: Array<{
    role: string
    content: string
  }>
}

// Mock AI responses for demonstration
// In production, integrate with OpenAI, Anthropic, or your AI service
const generateMockResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()

  // Course-related queries
  if (lowerMessage.includes('course') || lowerMessage.includes('class')) {
    return 'We offer a wide range of entrance exam preparation courses including Engineering, Medical, Management, and Law. Would you like to know more about a specific course?'
  }

  // Admission queries
  if (lowerMessage.includes('admission') || lowerMessage.includes('enroll')) {
    return 'Our admission process is simple! Browse our courses, select the one that fits your needs, and complete the enrollment. You can also contact our support team for personalized guidance.'
  }

  // Exam queries
  if (lowerMessage.includes('exam') || lowerMessage.includes('test')) {
    return 'We provide comprehensive preparation materials for various entrance exams. Our platform includes practice tests, video lectures, study notes, and expert guidance. Which exam are you preparing for?'
  }

  // Pricing queries
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
    return 'Our courses are competitively priced with flexible payment options. You can view detailed pricing on each course page. We also offer special discounts for early enrollments!'
  }

  // Support queries
  if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('contact')) {
    return 'Our support team is here to help! You can reach us via email at support@entrancegateway.com or call us at +977-XXX-XXXX. We\'re available Monday to Friday, 9 AM to 6 PM.'
  }

  // Greeting
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'Hello! Welcome to EntranceGateway. How can I assist you today? Feel free to ask about our courses, admissions, or exam preparation resources.'
  }

  // Default response
  return 'Thank you for your question! I\'m here to help you with information about our courses, admissions, exams, and more. Could you please provide more details about what you\'re looking for?'
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatbotRequest = await request.json()

    // Validate request
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: message is required' },
        { status: 400 }
      )
    }

    // Simulate processing delay (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Generate response
    const response = generateMockResponse(body.message)

    // Return response
    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'chatbot',
    timestamp: new Date().toISOString(),
  })
}
