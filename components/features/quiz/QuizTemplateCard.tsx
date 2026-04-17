'use client'

import type { QuizTemplate } from '@/types/quizTemplate.types'

interface QuizTemplateCardProps {
  template: QuizTemplate
  onClick: (templateId: string) => void
}

export function QuizTemplateCard({ template, onClick }: QuizTemplateCardProps) {

  return (
    <article className="flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden group">
      {/* Visual Header Banner */}
      <div className="h-2 w-full bg-gradient-to-r from-brand-gold to-yellow-300" />
      
      <div className="flex flex-col flex-grow p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="inline-block bg-brand-lavender text-brand-purple text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {template.type}
          </span>
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

        <h3 className="text-xl font-heading font-bold text-brand-navy mb-2 group-hover:text-brand-blue transition-colors">
          {template.name}
        </h3>

        {template.description ? (
          <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
            {template.description}
          </p>
        ) : (
          <div className="flex-grow mb-6" /> // spacer
        )}

        {/* Feature List */}
        <div className="space-y-2 mb-6 text-sm text-gray-600 border-t border-gray-100 pt-4">
          <div className="flex items-center">
            <span className="material-symbols-outlined text-[18px] mr-2 text-brand-gold">auto_awesome</span>
            <span>Dynamically generated questions</span>
          </div>
          {template.config?.durationMinutes && (
            <div className="flex items-center">
              <span className="material-symbols-outlined text-[18px] mr-2 text-gray-400">schedule</span>
              <span>{template.config.durationMinutes} Minutes Duration</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onClick(template.templateId)}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-brand-navy hover:bg-brand-blue text-white font-bold py-3 px-4 rounded-lg transition-colors focus-brand"
        >
          <span>View Details</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </article>
  )
}
