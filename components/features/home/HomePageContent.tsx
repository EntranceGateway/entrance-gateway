import type { Note } from '@/types/notes.types'
import type { Course } from '@/types/courses.types'
import type { Blog } from '@/types/blogs.types'
import type { Training } from '@/types/trainings.types'
import {
  HomeHero,
  HomePartners,
  HomeWhyChoose,
  HomeBrowseCategory,
  HomeSimpleSteps,
  HomeTestimonials,
  HomeLeadingCourses,
  HomeCTA,
  HomeNews,
} from './index'

interface HomePageContentProps {
  coursesData?: Course[]
  notesData?: Note[]
  blogsData?: Blog[]
  trainingsData?: Training[]
}

export function HomePageContent({
  coursesData,
  notesData,
  blogsData,
  trainingsData,
}: HomePageContentProps) {
  return (
    <>
      <HomeHero />
      {/* <HomePartners /> */}
      <HomeWhyChoose />
      <HomeBrowseCategory initialCoursesData={coursesData} initialNotesData={notesData} />
      <HomeSimpleSteps />
      <HomeLeadingCourses trainingsData={trainingsData} />
      <HomeTestimonials />
      {/* <HomeCTA /> */}
      <HomeNews blogsData={blogsData} />
    </>
  )
}
