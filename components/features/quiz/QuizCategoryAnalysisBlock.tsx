import { useState, useEffect } from 'react'
import { fetchCategoryAnalysis } from '@/services/client/quizAttempt.client'
import type { CategoryAnalysisItem } from '@/services/client/quizAttempt.client'

export function QuizCategoryAnalysisBlock() {
  const [analysisItems, setAnalysisItems] = useState<CategoryAnalysisItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAnalysis = async () => {
      setIsLoading(true)
      try {
        const response = await fetchCategoryAnalysis()
        setAnalysisItems(response?.data || [])
      } catch (err) {
        // Silently capture errors here so the main history tab isn't interrupted 
        // if this optional block fails to load.
        console.error('[QuizCategoryAnalysisBlock] Failed:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalysis()
  }, [])

  if (isLoading) {
    return (
      <div className="mb-10 w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4 animate-pulse bg-gray-200 h-6 w-48 rounded"></h2>
        <div className="flex gap-4 overflow-x-auto scbar-none pb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[280px] bg-white border border-gray-100 p-5 rounded-2xl animate-pulse h-24"></div>
          ))}
        </div>
      </div>
    )
  }

  if (analysisItems.length === 0) {
    return null // Return absolutely nothing so the UI naturally falls back to the Grid
  }

  return (
    <div className="mb-10 w-full relative group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-blue">donut_small</span>
          Topic Performance Profile
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scroll-safari" style={{ scrollbarWidth: 'none' }}>
        {analysisItems.map((topic, idx) => {
          const isExcellent = topic.percentage >= 80
          const isPassing = topic.percentage >= 60 && topic.percentage < 80

          return (
            <div 
              key={idx} 
              className="min-w-[280px] snap-center shrink-0 bg-white border border-gray-200 p-5 rounded-2xl relative overflow-hidden"
            >
              {/* Background accent based on score */}
              <div 
                className={`absolute inset-0 opacity-[0.03] ${
                  isExcellent ? 'bg-green-500' : isPassing ? 'bg-blue-500' : 'bg-orange-500'
                }`}
              ></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-1 pr-2" title={topic.topicName}>
                    {topic.topicName}
                  </h3>
                  <span className={`text-xs font-black shadow-sm px-2 py-0.5 rounded ${
                    isExcellent ? 'bg-green-100 text-green-700' : isPassing ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {topic.percentage.toFixed(0)}%
                  </span>
                </div>

                <div className="text-xs text-gray-500 mb-3 font-medium">
                  Accuracy: <span className="text-gray-900 font-bold">{topic.correctQuestions}</span> / {topic.totalQuestions}
                </div>

                {/* Smooth Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${
                      isExcellent ? 'bg-green-500' : isPassing ? 'bg-blue-400' : 'bg-orange-400'
                    }`}
                    style={{ width: `${topic.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Scroll Hint gradient on right edge */}
      <div className="absolute right-0 top-12 bottom-4 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none md:hidden"></div>
    </div>
  )
}
