interface ProfileStatsProps {
  totalEnrollments: number
  totalQuizAttempts: number
  totalPurchases: number
  totalAdmissions: number
}

export function ProfileStats({
  totalEnrollments,
  totalQuizAttempts,
  totalPurchases,
  totalAdmissions,
}: ProfileStatsProps) {
  const stats = [
    {
      icon: 'school',
      label: 'Enrollments',
      value: totalEnrollments,
      color: 'text-brand-navy',
      bgColor: 'bg-brand-navy/5',
    },
    {
      icon: 'assignment',
      label: 'Quiz Attempts',
      value: totalQuizAttempts,
      color: 'text-brand-blue',
      bgColor: 'bg-brand-blue/5',
    },
    {
      icon: 'receipt_long',
      label: 'Purchases',
      value: totalPurchases,
      color: 'text-brand-gold',
      bgColor: 'bg-brand-gold/10',
    },
    {
      icon: 'how_to_reg',
      label: 'Admissions',
      value: totalAdmissions,
      color: 'text-success',
      bgColor: 'bg-success/5',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4"
        >
          <div className={`size-12 ${stat.bgColor} ${stat.color} rounded-lg flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
              {stat.icon === 'school' && (
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              )}
              {stat.icon === 'assignment' && (
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              )}
              {stat.icon === 'receipt_long' && (
                <path d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5zM19 19c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11v14z" />
              )}
              {stat.icon === 'how_to_reg' && (
                <path d="M9 17l3-2.94c-.39-.04-.68-.06-1-.06-2.67 0-8 1.34-8 4v2h9l-3-3zm2-5c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m4.47 8.5L12 17l1.4-1.41 2.07 2.08 5.13-5.17 1.4 1.41z" />
              )}
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-brand-navy">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
