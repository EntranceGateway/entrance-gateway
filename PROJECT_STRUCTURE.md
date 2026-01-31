# 📁 Project Folder Structure

> A scalable, optimized, and maintainable folder structure for a **Next.js 16+ (App Router)** frontend with **Java backend** integration.

---

## 🗂️ Root Structure Overview

```
entrance-gateway/
├── app/                          # Next.js App Router (Pages, Layouts, SSR)
├── components/                   # Reusable UI Components
├── hooks/                        # Custom React Hooks
├── lib/                          # Core utilities, helpers, and configurations
├── services/                     # API service layer (Backend integration)
├── stores/                       # Global state management (Zustand/Context)
├── types/                        # TypeScript type definitions
├── constants/                    # App-wide constants and configurations
├── styles/                       # Global styles and theming
├── public/                       # Static assets (images, fonts, icons)
├── config/                       # Environment and app configurations
└── tests/                        # Unit and integration tests
```

---

## 📂 Detailed Folder Structure

```
entrance-gateway/
│
├── app/                                    # 🌐 Next.js App Router
│   ├── (auth)/                             # Route group for authentication pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx                      # Auth-specific layout (no sidebar)
│   │
│   ├── (dashboard)/                        # Route group for authenticated pages
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx                      # Dashboard layout (with sidebar)
│   │
│   ├── (public)/                           # Route group for public pages
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/                                # API Routes (Proxy to Java Backend)
│   │   ├── courses/                        # Courses API proxy
│   │   │   ├── [id]/
│   │   │   │   └── route.ts                # GET /api/courses/:id
│   │   │   ├── full-syllabus/
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts            # GET /api/courses/full-syllabus/:id
│   │   │   └── route.ts                    # GET /api/courses
│   │   ├── notes/                          # Notes API proxy
│   │   │   ├── [id]/
│   │   │   │   └── route.ts                # GET /api/notes/:id
│   │   │   ├── by-course-semester-affiliation/
│   │   │   │   └── route.ts                # GET /api/notes/by-course-semester-affiliation
│   │   │   └── route.ts                    # GET /api/notes
│   │   └── resources/                      # Resource files proxy (PDFs, images)
│   │       └── [id]/
│   │           └── route.ts                # GET /api/resources/:id
│   │
│   ├── error.tsx                           # Global error boundary
│   ├── loading.tsx                         # Global loading state
│   ├── not-found.tsx                       # 404 page
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                            # Homepage
│   └── globals.css                         # Global styles
│
├── components/                             # 🧩 Reusable UI Components
│   ├── ui/                                 # Primitive/Base components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   ├── Input.types.ts
│   │   │   └── index.ts
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Table/
│   │   ├── Form/
│   │   ├── Toast/
│   │   ├── Skeleton/
│   │   └── index.ts                        # Barrel export
│   │
│   ├── layout/                             # Layout components
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   ├── Footer/
│   │   ├── Sidebar/
│   │   ├── Navbar/
│   │   ├── PageHeader/
│   │   └── index.ts
│   │
│   ├── features/                           # Feature-specific components
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   └── index.ts
│   │   └── profile/
│   │       ├── ProfileCard.tsx
│   │       ├── EditProfileForm.tsx
│   │       └── index.ts
│   │
│   ├── shared/                             # Shared/Common components
│   │   ├── SEO/
│   │   │   ├── MetaTags.tsx
│   │   │   └── index.ts
│   │   ├── ErrorBoundary/
│   │   ├── LoadingSpinner/
│   │   ├── EmptyState/
│   │   ├── Pagination/
│   │   ├── SearchBar/
│   │   └── index.ts
│   │
│   └── providers/                          # Context Providers
│       ├── ThemeProvider.tsx
│       ├── AuthProvider.tsx
│       ├── QueryProvider.tsx               # React Query/TanStack
│       └── index.ts
│
├── hooks/                                  # 🪝 Custom React Hooks
│   ├── api/                                # API-related hooks
│   │   ├── useAuth.ts                      # Authentication hook
│   │   ├── useUser.ts                      # User data hook
│   │   ├── useFetch.ts                     # Generic fetch hook
│   │   ├── useMutation.ts                  # Generic mutation hook
│   │   └── index.ts
│   │
│   ├── ui/                                 # UI-related hooks
│   │   ├── useModal.ts
│   │   ├── useToast.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useDebounce.ts
│   │   ├── useThrottle.ts
│   │   ├── useClickOutside.ts
│   │   └── index.ts
│   │
│   ├── state/                              # State management hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useSessionStorage.ts
│   │   └── index.ts
│   │
│   └── index.ts                            # Barrel export
│
├── lib/                                    # 🔧 Core Utilities & Configurations
│   ├── utils/                              # Utility functions
│   │   ├── cn.ts                           # Classname utility (clsx + tailwind-merge)
│   │   ├── format.ts                       # Formatting helpers (date, currency, etc.)
│   │   ├── validation.ts                   # Validation helpers
│   │   ├── storage.ts                      # LocalStorage/SessionStorage utilities
│   │   └── index.ts
│   │
│   ├── auth/                               # Authentication utilities
│   │   ├── session.ts                      # Session management
│   │   ├── tokens.ts                       # Token handling (JWT)
│   │   ├── guard.ts                        # Route protection
│   │   └── index.ts
│   │
│   ├── validators/                         # Form validation schemas
│   │   ├── auth.schema.ts
│   │   ├── profile.schema.ts
│   │   └── index.ts
│   │
│   └── metadata.ts                         # SEO metadata utilities
│
├── services/                               # 🌐 API Service Layer
│   ├── api/                                # API client configuration
│   │   ├── client.ts                       # Axios/Fetch instance with interceptors
│   │   ├── endpoints.ts                    # API endpoints constants
│   │   └── index.ts
│   │
│   ├── server/                             # Server-side API calls (SSR)
│   │   ├── auth.server.ts                  # Auth APIs for SSR
│   │   ├── user.server.ts                  # User APIs for SSR
│   │   └── index.ts
│   │
│   ├── client/                             # Client-side API calls
│   │   ├── auth.client.ts                  # Auth APIs for client
│   │   ├── user.client.ts                  # User APIs for client
│   │   └── index.ts
│   │
│   └── types/                              # API-specific types
│       ├── requests.ts                     # Request payload types
│       ├── responses.ts                    # Response types
│       └── index.ts
│
├── stores/                                 # 📦 Global State Management
│   ├── auth.store.ts                       # Authentication state (Zustand)
│   ├── ui.store.ts                         # UI state (theme, sidebar, modals)
│   ├── user.store.ts                       # User data state
│   └── index.ts
│
├── types/                                  # 📝 TypeScript Type Definitions
│   ├── api.types.ts                        # API response/request types
│   ├── auth.types.ts                       # Authentication types
│   ├── user.types.ts                       # User types
│   ├── common.types.ts                     # Common/shared types
│   └── index.ts
│
├── constants/                              # 📌 Constants & Configurations
│   ├── routes.ts                           # Route path constants
│   ├── api.ts                              # API base URLs and endpoints
│   ├── messages.ts                         # UI messages/texts
│   ├── config.ts                           # App configuration
│   └── index.ts
│
├── styles/                                 # 🎨 Global Styles
│   ├── themes/                             # Theme configurations
│   │   ├── light.css
│   │   └── dark.css
│   ├── components/                         # Component-specific global styles
│   └── animations.css                      # Global animations
│
├── config/                                 # ⚙️ Configuration Files
│   ├── env.ts                              # Environment variable validation
│   ├── site.ts                             # Site metadata configuration
│   └── navigation.ts                       # Navigation configuration
│
├── tests/                                  # 🧪 Testing
│   ├── __mocks__/                          # Mock data and functions
│   ├── unit/                               # Unit tests
│   ├── integration/                        # Integration tests
│   └── e2e/                                # End-to-end tests
│
├── public/                                 # 📁 Static Assets
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── favicon.ico
│
├── .env.local                              # Local environment variables
├── .env.development                        # Development environment
├── .env.production                         # Production environment
├── next.config.ts                          # Next.js configuration
├── tailwind.config.ts                      # Tailwind CSS configuration
├── tsconfig.json                           # TypeScript configuration
└── package.json
```

---

## 🔄 Server-Side Rendering (SSR) Strategy

### File Naming Conventions

| File | Purpose |
|------|---------|
| `page.tsx` | Server Component (default) - SSR enabled |
| `layout.tsx` | Shared layout with SSR |
| `loading.tsx` | Streaming UI for loading states |
| `error.tsx` | Error boundary component |
| `template.tsx` | Re-renders on navigation |

### Data Fetching Patterns

```typescript
// app/(dashboard)/users/page.tsx - Server Component (SSR)
import { getUsers } from '@/services/server/user.server';

export default async function UsersPage() {
  const users = await getUsers(); // Fetches on server
  return <UserList users={users} />;
}
```

```typescript
// services/server/user.server.ts
import { apiClient } from '@/services/api/client';

export async function getUsers() {
  const res = await fetch(`${process.env.API_BASE_URL}/api/v1/users`, {
    cache: 'no-store', // Dynamic rendering (SSR)
    // cache: 'force-cache', // Static rendering (SSG)
    next: { revalidate: 60 }, // ISR - revalidate every 60 seconds
  });
  return res.json();
}
```

---

## 🔌 Java Backend Integration

### Proxy Server Architecture

The application uses **Next.js API Routes** as a proxy layer between the frontend and Java backend. This provides:

- ✅ **Security**: Backend URL hidden from client
- ✅ **CORS**: No cross-origin issues
- ✅ **Caching**: Server-side caching control
- ✅ **Authentication**: Centralized auth header injection
- ✅ **Error Handling**: Consistent error responses

### API Proxy Structure

```
app/api/
├── courses/
│   ├── route.ts                    # GET /api/courses → Java backend
│   ├── [id]/route.ts               # GET /api/courses/:id
│   └── full-syllabus/[id]/route.ts # GET /api/courses/full-syllabus/:id
├── notes/
│   ├── route.ts                    # GET /api/notes
│   ├── [id]/route.ts               # GET /api/notes/:id
│   └── by-course-semester-affiliation/route.ts
└── resources/
    └── [id]/route.ts               # GET /api/resources/:id (PDFs, images)
```

### Proxy Route Example

```typescript
// app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.entrancegateway.com'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '10'
    const sortBy = searchParams.get('sortBy') || 'courseName'
    const sortDir = searchParams.get('sortDir') || 'asc'

    const url = `${API_BASE_URL}/api/v1/courses?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
      cache: 'no-store', // SSR - no caching
    })

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch courses', data: null },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { message: 'Internal server error', data: null },
      { status: 500 }
    )
  }
}
```

### Client Service Layer

Client-side services call the Next.js proxy endpoints:

```typescript
// services/client/courses.client.ts
export async function fetchCourses(params: CoursesQueryParams = {}): Promise<CoursesListResponse> {
  const queryParams = new URLSearchParams({
    page: params.page?.toString() || '0',
    size: params.size?.toString() || '10',
    sortBy: params.sortBy || 'courseName',
    sortDir: params.sortDir || 'asc',
  })

  const response = await fetch(`/api/courses?${queryParams}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.statusText}`)
  }

  return response.json()
}
```

### Server Service Layer

Server-side services call the Java backend directly (for SSR):

```typescript
// services/server/courses.server.ts
export async function getCourses(params: CoursesQueryParams = {}): Promise<CoursesListResponse> {
  const queryParams = new URLSearchParams({
    page: params.page?.toString() || '0',
    size: params.size?.toString() || '10',
    sortBy: params.sortBy || 'courseName',
    sortDir: params.sortDir || 'asc',
  })

  const response = await fetch(
    `${API_BASE_URL}/api/v1/courses?${queryParams}`,
    {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
      cache: 'no-store', // Dynamic rendering (SSR)
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.statusText}`)
  }

  return response.json()
}
```

### Data Flow

```
┌─────────────────┐
│  Server Page    │  1. SSR: Direct call to Java backend
│  (page.tsx)     │     getCourses() → Java API
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Client Component│  2. Receives initialData from SSR
│ (PageContent)   │     Skips initial fetch if data exists
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User Interaction│  3. CSR: Calls Next.js proxy
│ (expand, filter)│     fetchFullSyllabus() → /api/courses/full-syllabus/:id
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Next.js Proxy  │  4. Proxy forwards to Java backend
│  (API Route)    │     /api/courses/full-syllabus/:id → Java API
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Java Backend   │  5. Returns data
│  (Spring Boot)  │     Response → Proxy → Client
└─────────────────┘
```

### API Client Configuration

```typescript
// services/api/client.ts
import { getSession } from '@/lib/auth/session';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const session = await getSession();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(session?.accessToken && {
      Authorization: `Bearer ${session.accessToken}`,
    }),
    ...options?.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
```

### Backend-for-Frontend (BFF) Pattern

```typescript
// app/api/[...proxy]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const JAVA_BACKEND_URL = process.env.JAVA_BACKEND_URL;

export async function GET(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const backendPath = pathname.replace('/api', '');
  
  const response = await fetch(`${JAVA_BACKEND_URL}${backendPath}${search}`, {
    headers: {
      Authorization: request.headers.get('Authorization') || '',
    },
  });

  return NextResponse.json(await response.json());
}
```

---

## 📦 Import Aliases

Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/hooks/*": ["hooks/*"],
      "@/lib/*": ["lib/*"],
      "@/services/*": ["services/*"],
      "@/stores/*": ["stores/*"],
      "@/types/*": ["types/*"],
      "@/constants/*": ["constants/*"],
      "@/styles/*": ["styles/*"],
      "@/config/*": ["config/*"]
    }
  }
}
```

---

## 🚀 Best Practices

### 1. Component Guidelines

- **Single Responsibility**: Each component should do one thing well
- **Composition over Inheritance**: Use composition patterns
- **Props Interface**: Always define TypeScript interfaces for props
- **Default Exports**: Use named exports for better refactoring

### 2. SSR Optimization

```typescript
// Use 'use client' only when necessary
'use client'; // Only for client-side interactivity

// Mark static data for caching
export const revalidate = 3600; // Revalidate every hour

// Use dynamic imports for code splitting
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'));
```

### 3. API Integration Patterns

```typescript
// services/server/user.server.ts - For Server Components
export async function getUserById(id: string) {
  return apiClient<User>(`/api/v1/users/${id}`, {
    next: { tags: ['user', `user-${id}`] }, // For on-demand revalidation
  });
}

// services/client/user.client.ts - For Client Components
export async function updateUser(id: string, data: UpdateUserDto) {
  return apiClient<User>(`/api/v1/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
```

### 4. Reusability Patterns

```typescript
// components/ui/Button/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }))} {...props}>
        {isLoading ? <Spinner /> : children}
      </button>
    );
  }
);
```

---

## 📋 Environment Variables

```bash
# .env.local
# ===========================================
# API Configuration
# ===========================================
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
JAVA_BACKEND_URL=http://localhost:8080

# ===========================================
# Authentication
# ===========================================
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# ===========================================
# Feature Flags
# ===========================================
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

---

## 🎯 Quick Reference

| Folder | Purpose | SSR/CSR |
|--------|---------|---------|
| `app/` | Routes & Pages | Both |
| `components/ui/` | Base UI components | CSR |
| `components/features/` | Feature-specific components | Both |
| `services/server/` | Server-side API calls | SSR |
| `services/client/` | Client-side API calls | CSR |
| `hooks/api/` | Data fetching hooks | CSR |
| `stores/` | Global state | CSR |

---

## 📚 Recommended Dependencies

```bash
# State Management
pnpm add zustand

# Data Fetching
pnpm add @tanstack/react-query

# Form Handling
pnpm add react-hook-form zod @hookform/resolvers

# UI Utilities
pnpm add clsx tailwind-merge

# Icons
pnpm add lucide-react

# Date Utilities
pnpm add date-fns

# HTTP Client (optional, if not using fetch)
pnpm add axios
```

---

> **Note**: This structure is designed for scalability. Start with the folders you need and add more as the project grows. The key is maintaining consistency and separation of concerns.
