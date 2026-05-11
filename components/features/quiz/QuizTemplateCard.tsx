'use client'

import type { QuizTemplate } from '@/types/quizTemplate.types'

interface QuizTemplateCardProps {
  template: QuizTemplate
  onClick: (templateId: string) => void
}

export function QuizTemplateCard({ template, onClick }: QuizTemplateCardProps) {
  const isPaid = template.entryFee > 0
  const priceLabel = isPaid ? `NPR ${template.entryFee.toLocaleString()}` : 'Free'
  return (
    <article className="flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden group">
      {/* Visual Header Banner */}
      <div className="h-2 w-full bg-gradient-to-r from-brand-gold to-yellow-300" />
      
      <div className="flex flex-col flex-grow p-4 sm:p-5">
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="inline-block bg-brand-lavender text-brand-purple text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {template.type}
            </span>
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              isPaid ? 'bg-brand-gold/20 text-brand-navy' : 'bg-green-100 text-green-700'
            }`}>
              {priceLabel}
            </span>
          </div>
          {template.difficulty && (
            <span className={`text-xs font-bold px-2 py-1 rounded ${
              template.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
              template.difficulty === 'MEDIUM' ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700'
            }`}>
              {template.difficulty}
            </span>
          )}
        </div>

        <h3 className="text-lg sm:text-xl font-heading font-bold text-brand-navy mb-2 group-hover:text-brand-blue transition-colors line-clamp-2 break-words">
          {template.name}
        </h3>

        {template.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-6">
            {template.description}
          </p>
        )}

        {/* Feature List */}
        <div className="mt-auto space-y-2.5 text-sm text-gray-600 border-t border-gray-100 pt-4">
          {template.entranceType?.entranceName && (
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined mt-0.5 w-5 shrink-0 text-center text-[18px] leading-none text-brand-purple">school</span>
              <span className="min-w-0 flex-1 leading-5">{template.entranceType.entranceName}</span>
            </div>
          )}
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined mt-0.5 w-5 shrink-0 text-center text-[18px] leading-none text-brand-gold">auto_awesome</span>
            <span className="min-w-0 flex-1 leading-5">Dynamically generated questions</span>
          </div>
          {template.config?.totalQuestions && (
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined mt-0.5 w-5 shrink-0 text-center text-[18px] leading-none text-gray-400">quiz</span>
              <span className="min-w-0 flex-1 leading-5">{template.config.totalQuestions} Questions</span>
            </div>
          )}
          {template.config?.durationMinutes && (
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined mt-0.5 w-5 shrink-0 text-center text-[18px] leading-none text-gray-400">schedule</span>
              <span className="min-w-0 flex-1 leading-5">{template.config.durationMinutes} Minutes Duration</span>
            </div>
          )}
          {template.config?.totalMarks && (
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined mt-0.5 w-5 shrink-0 text-center text-[18px] leading-none text-gray-400">score</span>
              <span className="min-w-0 flex-1 leading-5">{template.config.totalMarks} Marks</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onClick(template.templateId)}
          className="mt-5 w-full flex items-center justify-center gap-2 bg-brand-navy hover:bg-brand-blue text-white font-bold py-3 px-4 rounded-lg transition-colors focus-brand"
        >
          <span>View Details</span>
          <span className="material-symbols-outlined w-5 shrink-0 text-center text-[20px] leading-none">arrow_forward</span>
        </button>
      </div>
    </article>
  )
}
