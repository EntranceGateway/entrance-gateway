import { cn } from '@/lib/utils/cn'
import { SyllabusCard, SyllabusCardList } from './SyllabusCard'

interface SyllabusItem {
  id: string
  code: string
  name: string
  course: string
  yearSemester: string
  creditHours: number
}

interface SyllabusTableProps {
  data: SyllabusItem[]
  onItemClick?: (id: string) => void
}

export function SyllabusTable({ data, onItemClick }: SyllabusTableProps) {
  return (
    <>
      {/* Desktop Table View - Hidden on mobile/tablet */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-brand-navy text-white">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold tracking-wide border-b border-brand-navy/50"
                >
                  Course Code
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold tracking-wide border-b border-brand-navy/50 w-1/3"
                >
                  Subject Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold tracking-wide border-b border-brand-navy/50"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold tracking-wide border-b border-brand-navy/50"
                >
                  Year / Semester
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold tracking-wide border-b border-brand-navy/50 text-right"
                >
                  Credit Hours
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.map((item, index) => (
                <tr
                  key={item.id}
                  onClick={() => onItemClick?.(item.id)}
                  className={cn(
                    'transition-all duration-200 group cursor-pointer',
                    'hover:bg-blue-50 hover:shadow-md hover:scale-[1.01]',
                    index % 2 === 1 && 'bg-gray-50'
                  )}
                >
                  <td className="px-6 py-4 font-mono text-gray-600 font-medium group-hover:text-brand-blue transition-colors">
                    {item.code}
                  </td>
                  <td className="px-6 py-4 font-semibold text-brand-navy text-base group-hover:text-brand-blue transition-colors">
                    {item.name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border',
                        item.course === 'CSIT'
                          ? 'bg-blue-100/50 text-brand-blue border-blue-200'
                          : 'bg-indigo-100/50 text-indigo-700 border-indigo-200'
                      )}
                    >
                      {item.course}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.yearSemester}</td>
                  <td className="px-6 py-4 text-gray-600 text-right font-medium">
                    {item.creditHours} Cr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Card View - Hidden on desktop */}
      <div className="lg:hidden">
        <SyllabusCardList>
          {data.map((item) => (
            <SyllabusCard
              key={item.id}
              item={item}
              onClick={onItemClick}
            />
          ))}
        </SyllabusCardList>
      </div>
    </>
  )
}
