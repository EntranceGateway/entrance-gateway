import { HomePageContent } from '@/components/features/home/HomePageContent'
import { getCourses } from '@/services/server/courses.server'
import { getAllNotes } from '@/services/server/notes.server'
import { getBlogs } from '@/services/server/blogs.server'
import { getTrainings } from '@/services/server/trainings.server'

export const metadata = {
  title: 'EntranceGateway - Master Your Future with Academic Excellence',
  description:
    "Join thousands of students preparing for Nepal's toughest entrance exams with expert guidance, premium study materials, and real-time mock tests.",
}

export default async function Home() {
  // Fetch data for categories, news, and trainings (parallel execution)
  const [coursesResponse, notesResponse, blogsResponse, trainingsResponse] = await Promise.all([
    getCourses({ page: 0, size: 100 }).catch(() => null),
    getAllNotes().catch(() => null),
    getBlogs({ page: 0, size: 4, sortBy: 'createdDate', sortDir: 'desc' }).catch(() => null),
    getTrainings({ page: 0, size: 3, sortBy: 'trainingStatus', sortDir: 'asc' }).catch(() => null),
  ])

  const coursesData = coursesResponse?.data?.content || []
  const notesData = notesResponse?.data?.content || []
  const blogsData = blogsResponse?.data?.content || []
  const trainingsData = trainingsResponse?.data?.content || []

  return (
    <main className="flex-grow">
      <HomePageContent
        coursesData={coursesData}
        notesData={notesData}
        blogsData={blogsData}
        trainingsData={trainingsData}
      />
    </main>
  )
}
