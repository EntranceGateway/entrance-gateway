interface NotesFiltersProps {
  searchQuery: string
  selectedCourse: string
  selectedSemester: string
  onSearchChange: (value: string) => void
  onCourseChange: (value: string) => void
  onSemesterChange: (value: string) => void
  onFilter: () => void
}

export function NotesFilters({
  searchQuery,
  selectedCourse,
  selectedSemester,
  onSearchChange,
  onCourseChange,
  onSemesterChange,
  onFilter,
}: NotesFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 shadow-sm">
      <form className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search Input */}
        <div className="md:col-span-5 relative group">
          <label
            htmlFor="search"
            className="sr-only"
          >
            Search notes
          </label>
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors"
            >
              <path
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              id="search"
              name="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm transition-all outline-none text-gray-700 placeholder-gray-400"
              placeholder="Search by note name or subject code..."
            />
          </div>
        </div>

        {/* Course Select */}
        <div className="md:col-span-3">
          <label htmlFor="course" className="sr-only">
            Course
          </label>
          <select
            id="course"
            value={selectedCourse}
            onChange={(e) => onCourseChange(e.target.value)}
            className="w-full py-2.5 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm text-gray-700 outline-none cursor-pointer"
          >
            <option value="">All Courses</option>
            <option value="MBBS">MBBS</option>
            <option value="BSc. CSIT">BSc. CSIT</option>
            <option value="BBA">BBA</option>
            <option value="BDS">BDS</option>
            <option value="BCA">BCA</option>
            <option value="B.E. Computer Engineering">B.E. Computer Engineering</option>
          </select>
        </div>

        {/* Semester Select */}
        <div className="md:col-span-2">
          <label htmlFor="semester" className="sr-only">
            Semester
          </label>
          <select
            id="semester"
            value={selectedSemester}
            onChange={(e) => onSemesterChange(e.target.value)}
            className="w-full py-2.5 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm text-gray-700 outline-none cursor-pointer"
          >
            <option value="">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
            <option value="7">Semester 7</option>
            <option value="8">Semester 8</option>
          </select>
        </div>

        {/* Filter Button */}
        <div className="md:col-span-2">
          <button
            type="button"
            onClick={onFilter}
            className="w-full h-full py-2.5 bg-brand-navy hover:bg-brand-blue text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
            </svg>
            Filter Results
          </button>
        </div>
      </form>
    </div>
  )
}
