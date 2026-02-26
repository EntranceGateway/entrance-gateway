import Link from 'next/link'
import type { Training } from '@/types/trainings.types'

interface HomeLeadingCoursesProps {
  trainingsData?: Training[]
}

export function HomeLeadingCourses({ trainingsData = [] }: HomeLeadingCoursesProps) {
  // Format trainings for display
  const courses = trainingsData.map((training) => {
    const capacityPercentage = (training.currentParticipants / training.maxParticipants) * 100
    
    return {
      id: training.trainingId,
      title: training.trainingName,
      price: `Rs. ${training.price.toLocaleString()}`,
      duration: `${training.trainingHours} hrs`,
      status: training.trainingStatus,
      category: training.trainingCategory,
      type: training.trainingType,
      currentParticipants: training.currentParticipants,
      maxParticipants: training.maxParticipants,
      capacityPercentage,
    }
  })

  // Show message if no trainings available
  if (courses.length === 0) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-extrabold text-brand-navy font-heading">
                Our leading courses
              </h2>
              <p className="text-gray-600 mt-2">
                Prepared by industry experts for maximum clarity and cognitive ease.
              </p>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-brand-navy font-heading">
              Our leading courses
            </h2>
            <p className="text-gray-600 mt-2">
              Prepared by industry experts for maximum clarity and cognitive ease.
            </p>
          </div>
          <Link
            href="/trainings"
            className="bg-brand-navy text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-opacity-90 transition-all hidden md:block"
          >
            Explore All Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/trainings/${course.slug || course.trainingId}`}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="p-6">
                {/* Header: Status Badge and Category */}
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded ${
                      course.status === 'UPCOMING'
                        ? 'bg-warning/10 text-warning'
                        : course.status === 'ONGOING'
                          ? 'bg-success/10 text-success'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {course.status}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {course.category}
                  </span>
                </div>

                {/* Training Title */}
                <h3 className="text-xl font-bold text-brand-navy  leading-tight h-14 line-clamp-2 group-hover:text-brand-blue transition-colors">
                  {course.title}
                </h3>

                {/* Training Details Grid */}
                <div className="grid grid-cols-3 gap-2 mb-6 py-4 border-y border-gray-100">
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Type</div>
                    <div className="text-xs font-bold text-gray-800">{course.type}</div>
                  </div>
                  <div className="text-center border-x border-gray-100 px-1">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Duration</div>
                    <div className="text-xs font-bold text-gray-800">{course.duration}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Price</div>
                    <div className="text-xs font-bold text-brand-blue">{course.price}</div>
                  </div>
                </div>

                {/* Capacity Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-gray-600">Capacity</span>
                    <span className="text-xs font-bold text-brand-navy">
                      {course.currentParticipants}/{course.maxParticipants} joined
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`${
                        course.capacityPercentage >= 80 ? 'bg-warning' : 'bg-brand-blue'
                      } h-full rounded-full transition-all duration-300`}
                      style={{ width: `${course.capacityPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/trainings"
            className="bg-brand-navy text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-opacity-90 transition-all inline-block"
          >
            Explore All Courses
          </Link>
        </div>
      </div>
    </section>
  )
}
