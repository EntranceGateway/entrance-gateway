'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CollegeDetailHero } from './CollegeDetailHero'
import { CollegeAbout } from './CollegeAbout'
import { CollegeCourses } from './CollegeCourses'
import { CollegeSidebar } from './CollegeSidebar'
import { CollegeContactMobile } from './CollegeContactMobile'
import { CenteredSpinner } from '@/components/shared/Loading'
import { useResourceImage } from '@/hooks/api/useResourceImage'
import { fetchCollegeById } from '@/services/client/colleges.client'
import { useToast } from '@/components/shared/Toast'
import type { College, CollegeDetailResponse } from '@/types/colleges.types'
import type { CourseLevel } from '@/types/courses.types'

interface CollegeDetailContentProps {
  collegeId: string
  initialData?: CollegeDetailResponse | null
}

export function CollegeDetailContent({ collegeId, initialData }: CollegeDetailContentProps) {
  const { showToast } = useToast()
  const [college, setCollege] = useState<College | null>(initialData?.data || null)
  const [isLoading, setIsLoading] = useState(false) // Start as false, only set to true if we need to fetch
  const [error, setError] = useState<string | null>(null)

  // Fetch college data (skip if we have SSR data)
  useEffect(() => {
    // If we have initial data, don't fetch
    if (initialData) {
      return
    }

    // Only fetch if we don't have college data
    if (!college) {
      const loadCollege = async () => {
        setIsLoading(true)
        setError(null)

        try {
          const response = await fetchCollegeById(collegeId)
          setCollege(response.data)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load college'
          setError(errorMessage)
          showToast(errorMessage, 'error')
        } finally {
          setIsLoading(false)
        }
      }

      loadCollege()
    }
  }, [collegeId, initialData, college, showToast])

  // Fetch logo and cover images using resource hook
  const { src: logoSrc } = useResourceImage(college?.logoName || null, {
    enabled: !!college?.logoName,
  })

  const { src: coverSrc } = useResourceImage(
    college?.collegePictureName?.[0] || null,
    {
      enabled: !!college?.collegePictureName?.[0],
    }
  )

  // Loading State
  if (isLoading) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <CenteredSpinner size="lg" text="Loading college..." />
        </div>
      </main>
    )
  }

  // Error State
  if (error || !college) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-600 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div>
                <h3 className="font-bold text-lg text-red-900 mb-1">Failed to load college</h3>
                <p className="text-sm text-red-700">{error || 'College not found'}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/colleges"
                className="inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-900"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back to Colleges
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Transform API data to component props
  const getLevelFromCourseLevel = (level: CourseLevel): 'Undergraduate' | 'Postgraduate' | 'High School' => {
    switch (level) {
      case 'BACHELOR':
        return 'Undergraduate'
      case 'MASTER':
        return 'Postgraduate'
      case 'DIPLOMA':
        return 'High School'
      default:
        return 'Undergraduate'
    }
  }

  const getDurationFromCourseType = (type: string): string => {
    if (type === 'SEMESTER') {
      return '4 Years (8 Semesters)'
    }
    return '4 Years'
  }

  const transformedCourses = college.courses.map((course) => ({
    id: course.courseId.toString(),
    name: course.courseName,
    fullName: course.description.split('\n')[0] || course.courseName,
    description: course.description,
    level: getLevelFromCourseLevel(course.courseLevel),
    duration: getDurationFromCourseType(course.courseType),
    admissionCriteria: course.criteria,
    affiliation: course.affiliation,
  }))

  const contactInfo = {
    website: college.website,
    phone: college.contact,
    email: college.email,
  }

  // Generate logo text from college name (first letters of each word)
  const logoText = college.collegeName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 4)

  // Use cover image or fallback
  const coverImage = coverSrc || '/classroom.jpg'

  // Check if admissions are open (can be enhanced with actual logic)
  const admissionsOpen = college.priority === 'HIGH'

  return (
    <main className="flex-grow w-full">
      {/* Hero Section */}
      <CollegeDetailHero
        name={college.collegeName}
        location={college.location}
        affiliation={college.affiliation.replace(/_/g, ' ')}
        established={college.establishedYear}
        coverImage={coverImage}
        logoText={logoText}
        logoSrc={logoSrc}
        isFeatured={college.priority === 'HIGH'}
        isVerified={college.collegeType === 'GOVERNMENT'}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* About Section */}
            <CollegeAbout description={college.description} />

            {/* Courses Section */}
            <CollegeCourses courses={transformedCourses} />

            {/* Contact Info - Mobile Only */}
            <CollegeContactMobile 
              contactInfo={contactInfo}
              latitude={college.latitude}
              longitude={college.longitude}
              collegeName={college.collegeName}
            />
          </div>

          {/* Right Column - Sidebar */}
          <CollegeSidebar
            contactInfo={contactInfo}
            admissionsOpen={admissionsOpen}
            latitude={college.latitude}
            longitude={college.longitude}
            collegeName={college.collegeName}
          />
        </div>
      </div>
    </main>
  )
}
