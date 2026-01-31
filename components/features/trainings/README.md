# Trainings Feature

## Overview

The Trainings feature displays upcoming technical training programs and courses offered by EntranceGateway. It follows the same patterns as Notes and Colleges features.

## Components

### TrainingsHeader
- Displays page title, breadcrumb, and description
- Matches the design pattern from the reference HTML
- Located at the top of the page

### TrainingsCard
- Displays individual training information
- Shows:
  - Status badge (UPCOMING, ONGOING, etc.)
  - Category tag
  - Training title
  - Type, Duration, and Price in a 3-column grid
  - Capacity progress bar with visual indicators
  - View Details button
  - Download Syllabus link (if available)
- Progress bar color changes based on capacity:
  - Blue: < 80% capacity
  - Warning (yellow): ≥ 80% capacity

### TrainingsCardGrid
- Container component for the card grid
- Responsive layout:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 4 columns

### TrainingsPageContent
- Main page component
- Handles:
  - Loading states (skeleton)
  - Error states
  - Empty states
  - Data fetching (currently mock data)
  - Navigation to detail pages
  - Syllabus downloads

## File Structure

```
components/features/trainings/
├── TrainingsHeader.tsx          # Page header with breadcrumb
├── TrainingsCard.tsx            # Training card component
├── TrainingsPageContent.tsx     # Main page content
├── index.ts                     # Barrel exports
└── README.md                    # This file

app/(dashboard)/trainings/
├── page.tsx                     # Server component (SSR)
└── loading.tsx                  # Loading skeleton

types/
└── trainings.types.ts           # TypeScript types
```

## Usage

### Basic Usage

```tsx
import { TrainingsPageContent } from '@/components/features/trainings'

export default function TrainingsPage() {
  return <TrainingsPageContent />
}
```

### With SSR Data

```tsx
import { TrainingsPageContent } from '@/components/features/trainings'
import { getTrainings } from '@/services/server/trainings.server'

export default async function TrainingsPage() {
  const initialData = await getTrainings({ page: 0, size: 12 }).catch(() => null)
  
  return <TrainingsPageContent initialData={initialData} />
}
```

## API Integration

### Types

```typescript
interface Training {
  trainingId: number
  title: string
  category: string
  type: 'REMOTE' | 'IN_PERSON' | 'HYBRID'
  duration: number // in hours
  price: number
  currency: string
  capacity: number
  enrolled: number
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
  startDate: string
  endDate: string
  description: string
  syllabus?: string // PDF file name
  instructor?: string
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
}
```

### Server Service (To be implemented)

```typescript
// services/server/trainings.server.ts
export async function getTrainings(params: TrainingsQueryParams = {}) {
  const queryParams = new URLSearchParams({
    page: params.page?.toString() || '0',
    size: params.size?.toString() || '12',
    sortBy: params.sortBy || 'startDate',
    sortDir: params.sortDir || 'asc',
  })

  const response = await fetch(
    `${API_BASE_URL}/api/v1/trainings?${queryParams}`,
    {
      method: 'GET',
      headers: { 'Accept': '*/*' },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch trainings')
  }

  return response.json()
}
```

### Client Service (To be implemented)

```typescript
// services/client/trainings.client.ts
export async function fetchTrainings(params: TrainingsQueryParams = {}) {
  const queryParams = new URLSearchParams({
    page: params.page?.toString() || '0',
    size: params.size?.toString() || '12',
    sortBy: params.sortBy || 'startDate',
    sortDir: params.sortDir || 'asc',
  })

  const response = await fetch(`/api/trainings?${queryParams}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch trainings')
  }

  return response.json()
}
```

## Design Tokens

The component uses the project's design tokens:

- **Brand Colors**: `text-brand-navy`, `bg-brand-blue`, `bg-brand-gold`
- **Semantic Colors**: `bg-semantic-warning`, `text-semantic-error`
- **Typography**: `font-heading` for titles
- **Spacing**: Consistent with other features

## Responsive Design

- **Mobile (< 768px)**: Single column layout
- **Tablet (768px - 1023px)**: 2-column grid
- **Desktop (≥ 1024px)**: 4-column grid

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements
- Color contrast meets WCAG standards

## Future Enhancements

1. Add filters (category, type, status)
2. Add search functionality
3. Add pagination
4. Implement actual API integration
5. Add training detail page
6. Add enrollment functionality
7. Add instructor information
8. Add reviews/ratings
