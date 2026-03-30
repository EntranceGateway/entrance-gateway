import type { Training } from '@/types/trainings.types'

interface TrainingsDetailHeroProps {
  training: Training
}

export function TrainingsDetailHero({ training }: TrainingsDetailHeroProps) {
  return (
    <section className="bg-brand-navy py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <span data-role="training-status" className="px-3 py-1 bg-brand-blue text-white text-xs font-bold rounded-full tracking-wider uppercase">
              {training.trainingStatus}
            </span>
            <span data-role="category" className="text-gray-300 text-sm font-medium uppercase tracking-widest">
              {training.trainingCategory}
            </span>
          </div>
          <h1 data-role="page-title" className="text-4xl lg:text-5xl font-bold text-white leading-tight font-heading">
            {training.trainingName}
          </h1>
          <p data-role="description" className="text-blue-100 max-w-2xl text-lg opacity-90">
            {training.description}
          </p>
        </div>
      </div>
    </section>
  )
}
