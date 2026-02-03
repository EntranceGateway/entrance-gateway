import type { Training, TrainingEnrollmentResponse } from '@/types/trainings.types'

interface TrainingsDetailSidebarProps {
  training: Training
  onRegister?: () => void
  enrollmentStatus?: TrainingEnrollmentResponse | null
  isCheckingEnrollment?: boolean
  onViewEnrollment?: () => void
}

export function TrainingsDetailSidebar({ 
  training, 
  onRegister,
  enrollmentStatus,
  isCheckingEnrollment = false,
  onViewEnrollment,
}: TrainingsDetailSidebarProps) {
  // Calculate capacity percentage
  const capacityPercentage = (training.currentParticipants / training.maxParticipants) * 100
  const availableSeats = training.maxParticipants - training.currentParticipants

  // Check enrollment status
  const isEnrolled = enrollmentStatus?.data !== null
  const enrollmentData = enrollmentStatus?.data
  const isConfirmed = enrollmentData?.status === 'COMPLETED' || enrollmentData?.status === 'ACTIVE'
  const isPaymentReceived = enrollmentData?.status === 'PAYMENT_RECEIVED_ADMIN_APPROVAL_PENDING'
  const isPending = enrollmentData?.status === 'PAYMENT_PENDING'

  return (
    <aside className="lg:sticky lg:top-24">
      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Price Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-baseline gap-1">
            <span className="text-gray-500 text-sm font-medium">NPR</span>
            <span className="text-4xl font-bold text-brand-navy">
              {training.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Training Info */}
          <div className="space-y-4">
            {/* Duration */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-blue">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
                <span>Duration</span>
              </div>
              <span className="font-semibold text-gray-900">{training.trainingHours} Hours</span>
            </div>

            {/* Type */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-blue">
                  <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
                </svg>
                <span>Type</span>
              </div>
              <span className="font-semibold text-gray-900">{training.trainingType}</span>
            </div>

            {/* Location */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-blue">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>Location</span>
              </div>
              <span className="font-semibold text-gray-900">{training.location}</span>
            </div>
          </div>

          {/* Availability Progress */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-end text-sm mb-1">
              <span className="text-gray-500 font-medium">Availability</span>
              <span className="text-brand-navy font-bold">
                {training.currentParticipants}/{training.maxParticipants} filled
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-brand-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${capacityPercentage}%` }}
              />
            </div>
          </div>

          {/* Register Button or Enrollment Status */}
          {isCheckingEnrollment ? (
            <div className="w-full py-4 text-center text-gray-500 text-sm">
              Checking enrollment status...
            </div>
          ) : isPaymentReceived ? (
            <button
              onClick={onViewEnrollment}
              className="w-full bg-brand-blue hover:bg-brand-navy text-white font-bold py-4 rounded-lg shadow-md transition-all uppercase tracking-wide flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
              <span>View Enrollment</span>
            </button>
          ) : isConfirmed ? (
            <div className="w-full bg-semantic-success text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer" onClick={onViewEnrollment}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span>View Enrollment</span>
            </div>
          ) : isPending ? (
            <button
              onClick={onRegister}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-lg shadow-md transition-all uppercase tracking-wide flex items-center justify-center gap-2"
            >
              <span>Complete Payment</span>
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onRegister}
              disabled={availableSeats <= 0}
              className="w-full bg-brand-gold hover:bg-[#EBB000] text-brand-navy font-bold py-4 rounded-lg shadow-md transition-all uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{availableSeats > 0 ? 'Register Now' : 'Training Full'}</span>
              {availableSeats > 0 && (
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                </svg>
              )}
            </button>
          )}

          {/* Limited Seats Notice */}
          <p className="text-center text-[11px] text-gray-400 uppercase tracking-tighter">
            {availableSeats > 0 
              ? `${availableSeats} seats available for this cohort`
              : 'Training is full'}
          </p>
        </div>
      </div>

      {/* Certificate Badge */}
      {training.certificateProvided && (
        <div className="mt-6 p-4 bg-semantic-success/5 border border-semantic-success/20 rounded-lg flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 text-semantic-success shrink-0">
            <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
          </svg>
          <span className="text-xs text-semantic-success font-medium">
            Certified Training Program
          </span>
        </div>
      )}
    </aside>
  )
}
