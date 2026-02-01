# Trainings Feature

## Overview

The trainings feature provides a complete training program management system with listing, detail, and enrollment pages.

## Components

### TrainingsPageContent
Main listing page showing all available training programs in a responsive grid layout.

**Features:**
- 4-column responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop, 4 cols large)
- Training cards with image, title, category, price, duration, and availability
- Hover effects and smooth transitions

### TrainingsDetailContent
Detailed view of a single training program with comprehensive information.

**Features:**
- Hero section with training image and key details
- About section with syllabus and learning highlights
- Who should attend section
- Sticky sidebar with pricing and registration
- Certificate badge if applicable
- Download materials button if available

### TrainingEnrollmentContent
Enrollment form for users to register for a training program.

**Features:**
- **Important Notices Section:**
  - Warning to verify personal information before submission
  - Payment deadline notice (24-hour expiration)
  - Enrollment process information
- Pre-filled personal information from user profile
- Educational background display
- Training summary sidebar with payment reminder
- Comprehensive terms and conditions with checkboxes
- Availability check
- Success/error toast notifications
- Automatic redirect after successful enrollment

**User Warnings:**
1. **Verify Information**: Users are warned to check their profile details and update if needed
2. **Payment Deadline**: Clear notice that enrollment expires if payment is not completed within 24 hours
3. **Enrollment Process**: Step-by-step information about what happens after submission

## Routes

- `/trainings` - Training listing page
- `/trainings/[id]` - Training detail page
- `/trainings/[id]/enroll` - Training enrollment page

## Data Flow

### SSR (Server-Side Rendering)
All pages fetch initial data on the server for better SEO and performance:
- Training listing: `getTrainings()`
- Training detail: `getTrainingById(id)`
- Enrollment: `getTrainingById(id)` + `getUserProfile()`

### CSR (Client-Side Rendering)
Client components handle:
- Interactive filtering (if implemented)
- Form submissions
- Navigation
- Toast notifications

## API Integration

### Endpoints Used
- `GET /api/v1/trainings` - List all trainings
- `GET /api/v1/trainings/{id}` - Get training details
- `GET /api/v1/user/me` - Get user profile (for enrollment)
- `POST /api/v1/training-enrollments/{trainingId}/enroll` - Enroll in training

### Enrollment API

**Endpoint**: `POST /api/v1/training-enrollments/{trainingId}/enroll`

**Content-Type**: `multipart/form-data`

**Headers**:
- `Authorization: Bearer {accessToken}` - Required
- `Idempotency-Key: {uuid}` - Required (auto-generated)

**Request Body** (multipart/form-data):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| request | JSON | Yes | Payment request data |
| file | File | Yes | Payment proof image/document |

**Request JSON Structure**:
```json
{
  "amount": 500.00,
  "paymentMethod": "BANK_TRANSFER",
  "remarks": "Paid via bank transfer on 2026-02-01"
}
```

**Response**:
```json
{
  "message": "Enrollment successful",
  "data": {
    "enrollmentId": 123,
    "trainingId": 6,
    "userId": 45,
    "enrollmentDate": "2026-02-01T10:30:00",
    "status": "PENDING"
  }
}
```

**Idempotency Key**:
The API requires an `Idempotency-Key` header (UUID v4 format) to prevent duplicate enrollments. This is automatically generated using `generateUUID()` utility function.

**Payment Methods**:
- `FONEPAY` - FonePay QR code payment
- `BANK_TRANSFER` - Direct bank transfer

**Implementation**:
```typescript
import { enrollInTraining } from '@/services/client/trainings.client'

const response = await enrollInTraining(trainingId, {
  amount: 500.00,
  paymentMethod: 'BANK_TRANSFER',
  remarks: 'Paid via bank transfer on 2026-02-01',
  proofFile: file // File object from input
})
```

## User Flow

1. **Browse Trainings**: User views all available trainings on `/trainings`
2. **View Details**: User clicks on a training card to view details at `/trainings/[id]`
3. **Register**: User clicks "Register Now" button
4. **Enrollment Form**: User is redirected to `/trainings/[id]/enroll`
5. **Review Information**: User reviews pre-filled personal and educational information
6. **Accept Terms**: User checks the terms and conditions checkbox
7. **Submit**: User clicks "Confirm Enrollment"
8. **Confirmation**: Success toast appears and user is redirected back to training details

## Design Tokens

All components use the project's design tokens:
- `text-brand-navy` - Primary text color
- `bg-brand-blue` - Interactive elements
- `bg-brand-gold` - CTA buttons
- `text-semantic-success` - Success states
- `text-semantic-error` - Error states

## Responsive Design

### Mobile (< 640px)
- Single column layout
- Stacked sidebar below content
- Full-width cards

### Tablet (640px - 1024px)
- 2-column grid for cards
- Stacked layout for detail pages

### Desktop (≥ 1024px)
- 3-4 column grid for cards
- Sidebar layout for detail pages
- Sticky sidebar on enrollment page

## Loading States

All pages include proper loading states:
- Skeleton screens for listing page
- Centered spinner for detail and enrollment pages
- Button loading states during form submission

## Error Handling

- API errors display user-friendly error messages
- Form validation prevents invalid submissions
- Toast notifications for success/error feedback
- Graceful fallbacks for missing data
