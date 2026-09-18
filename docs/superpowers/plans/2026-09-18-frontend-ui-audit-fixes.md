# Frontend UI Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every finding from the general UI/code-quality audit of `entrance-gateway` (public frontend) and `entrancegateway-cms` (admin panel) — a live security exposure, a payment-integrity bug affecting every real user, three smaller real bugs, and a batch of debug-leftover cleanup.

**Architecture:** Two independent Next.js/TypeScript repos, no shared code between them. Tasks are grouped by severity, not by repo — Phase 1 is the two things that actually matter in production; Phase 2 is real-but-lower-risk bugs; Phase 3 is cleanup. Within a phase, tasks are independent of each other (different files, no shared state).

**Tech Stack:** Next.js, TypeScript. No new dependencies for any task.

**Spec:** This plan's own findings section below — sourced from a live, read-only audit of both repos' actual code, done 2026-09-18, with the two most severe findings (Tasks 1-2) independently re-verified by reading the real files a second time before this plan was written.

## Global Constraints

- No new dependencies.
- Do not run `git add`/`git commit`/`git push` at any point in this plan — the user commits their own work, in both repos. Every task ends at "leave the change in the working tree," never at a commit step.
- No live backend is reachable in this sandbox (confirmed repeatedly across this whole session) — any task whose correctness depends on a real server response can only be verified by `tsc`/static reading here; say so plainly in that task rather than claiming a false pass.
- **Deliberately excluded from this plan, not silently dropped:** the audit's two LOW-severity items — `entrance-gateway/components/features/enrollments/EnrollmentCard.tsx` vs `MyEnrollmentCard.tsx` duplication (cosmetic, the two components operate on genuinely different domain types, not a functional bug) and scattered `any`-typed props/params (e.g. `entrance-gateway/components/features/courses/CourseDetailContent.tsx:248`, a few hooks in `entrancegateway-cms/src/hooks/`). These are maintenance-smell/YAGNI territory, not bugs — do not add tasks for them unless the user asks for them specifically in a future plan.

---

## Phase 1 — Critical: security exposure and payment-integrity bug

Both of these are live and reachable in production right now. Ship this phase first and separately from everything else.

### Task 1: Remove the unguarded `/debug-auth` page

**Files:**
- Delete: `C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrancegateway-cms\app\debug-auth\page.tsx`
- Modify: `C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrancegateway-cms\proxy.ts:5`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing — this is a deletion, no other file depends on `/debug-auth` existing (confirmed: the only references anywhere in the repo are Next.js's own generated `.next/dev/types/*` build artifacts, which regenerate automatically and are not source code).

The page (`app/debug-auth/page.tsx`) reads `localStorage.getItem('accessToken')`, `refreshToken`, `userData`, and `document.cookie`, and renders them as plaintext on screen with a "Clear All Auth Data & Reload" button. It is explicitly whitelisted as a no-auth-required public route:

```typescript
// proxy.ts:5 — current
const publicPaths = ['/login', '/debug-auth'];
```

- [ ] **Step 1: Re-confirm nothing in real source code links to or imports this page**

Run:
```bash
grep -rn "debug-auth" --include="*.tsx" --include="*.ts" C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrancegateway-cms --exclude-dir=node_modules --exclude-dir=.next
```
Expected: only `app/debug-auth/page.tsx` itself and `proxy.ts:5`. If anything else references it (a nav link, a redirect), stop and report that — deleting the page would then break something that currently links to it, and this task needs to be re-scoped.

- [ ] **Step 2: Delete the page**

Delete `app/debug-auth/page.tsx`. If `app/debug-auth/` is now an empty directory, remove the empty directory too.

- [ ] **Step 3: Remove the whitelist entry**

```typescript
// proxy.ts:5 — after
const publicPaths = ['/login'];
```

- [ ] **Step 4: Verify TypeScript compiles clean**

Run: `npx tsc --noEmit` (from `entrancegateway-cms`)
Expected: no errors.

- [ ] **Step 5: Confirm the route is genuinely gone**

Run: `npm run dev`, navigate to `/debug-auth` in a browser. Expected: 404 (Next.js's standard not-found page), not the debug page. This is fully verifiable without a live backend — it's a pure routing/build check.

Leave the change in the working tree — no commit.

---

### Task 2: Fix `QuizPaymentPage` submitting real payments with fake quiz data

**Files:**
- Modify: `C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\components\features\quiz\QuizPaymentPage.tsx`

**Interfaces:**
- Consumes: `fetchQuizBySlug(slug: string): Promise<any>` — already exists and is already correctly implemented in `services/client/quiz.client.ts`, re-exported from `services/client/index.ts`. It calls the real backend endpoint `GET /api/v1/question-sets/slug/{slug}` (`entrance-backend/src/main/java/com/entrance_gateway/question_set/QuestionSetController.java:34-36`), which returns a `QuestionSetResponse` (`entrance-backend/.../question_set/QuestionSetResponse.java`) with fields `questionSetId, slug, setName, nosOfQuestions, durationInMinutes, description, price, courseId, courseName` (plus `entranceTypeId`/`entranceTypeName`, unused here) — this matches the `Quiz` interface (`types/quiz.types.ts:3-13`) field-for-field.
- Produces: nothing new — no other file depends on this component's internals.

Current (mock data, ignores `slug` entirely):
```tsx
// QuizPaymentPage.tsx — current second useEffect
useEffect(() => {
  // TODO: Fetch quiz details by slug
  // For now, using mock data
  const timer = setTimeout(() => {
    setQuiz({
      questionSetId: 2,
      slug: 'bca-i-9cf270',
      setName: 'BCA I',
      nosOfQuestions: 10,
      durationInMinutes: 15,
      description: 'Comprehensive test for BCA first semester',
      price: 0.01,
      courseId: 2,
      courseName: 'BCA',
    })
    setIsLoading(false)
  }, 500)
  return () => clearTimeout(timer)
}, [slug])
```

`handleSubmit` (unchanged by this task, shown for context — it already calls the real API using whatever `quiz` state holds):
```tsx
await submitPaymentWithProof(
  quiz.questionSetId,
  'QUIZ',
  paymentRequest,
  receiptFile
)
```

The file's existing error-handling style (in `handleSubmit`, lines further down — read this before writing Task 2's fix so the new code matches it, don't invent a different style):
```tsx
} catch (err) {
  // User-friendly error messages
  let errorMessage = 'Failed to submit payment proof. Please try again.'
  if (err instanceof Error) {
    const message = err.message.toLowerCase()
    if (message.includes('network') || message.includes('fetch')) {
      errorMessage = 'Network error. Please check your connection and try again.'
    } else if (message.includes('unauthorized') || message.includes('authentication')) {
      errorMessage = 'Session expired. Please log in again.'
    } else if (message.includes('file') || message.includes('upload')) {
      errorMessage = 'Failed to upload receipt. Please try a different file.'
    } else if (message.includes('already') || message.includes('duplicate')) {
      errorMessage = 'You have already submitted a payment for this quiz.'
    } else {
      errorMessage = err.message
    }
  }
  setError(errorMessage)
  console.error('Payment submission error:', err)
  // ...
}
```

- [ ] **Step 1: Confirm `fetchQuizBySlug` is importable and re-confirm the endpoint it calls**

Run:
```bash
grep -n "fetchQuizBySlug" C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\services\client\index.ts C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\services\client\quiz.client.ts
```
Expected: it's defined in `quiz.client.ts` and re-exported from `index.ts`. If either has changed shape since this plan was written, read the current version before proceeding — don't blindly copy this task's snippet if the real function no longer matches.

- [ ] **Step 2: Replace the mock effect with a real fetch, using the file's own error-handling style**

```tsx
// QuizPaymentPage.tsx — replaces the second useEffect shown above
import { fetchQuizBySlug } from '@/services/client/quiz.client'
// (add this import near the top of the file, alongside the existing `submitPaymentWithProof` import)

useEffect(() => {
  let cancelled = false

  async function loadQuiz() {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchQuizBySlug(slug)
      if (!cancelled) {
        setQuiz(data)
      }
    } catch (err) {
      if (cancelled) return
      let errorMessage = 'Failed to load quiz details. Please try again.'
      if (err instanceof Error) {
        const message = err.message.toLowerCase()
        if (message.includes('network') || message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (message.includes('not found') || message.includes('404')) {
          errorMessage = 'This quiz could not be found.'
        } else {
          errorMessage = err.message
        }
      }
      setError(errorMessage)
      console.error('Failed to fetch quiz by slug:', err)
    } finally {
      if (!cancelled) setIsLoading(false)
    }
  }

  loadQuiz()
  return () => {
    cancelled = true
  }
}, [slug])
```
This mirrors `handleSubmit`'s existing `err instanceof Error` + lowercase-message-matching style (trimmed to the error categories that actually apply to a GET-by-slug: network failure and not-found — don't copy `handleSubmit`'s "already submitted"/"file upload" branches, they don't apply to fetching quiz details). The `cancelled` flag prevents a state update after unmount if `slug` changes quickly or the component unmounts mid-fetch — the original mock code's `clearTimeout` cleanup served the same purpose for the fake timer; this is the equivalent guard for a real async fetch.

- [ ] **Step 3: Verify TypeScript compiles clean**

Run: `npx tsc --noEmit` (from `entrance-gateway`) — note from the audit: this repo's local `node_modules/typescript` may be broken/missing (`pnpm exec tsc` previously failed with `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`). If so, run `pnpm install` first (a real, human-visible install, not something to force through non-interactively) and note in your report that this was needed.
Expected: no errors. `fetchQuizBySlug` returns `Promise<any>`, so `setQuiz(data)` against the `Quiz`-typed state will type-check regardless of the real response shape — this task does not fix that pre-existing `any` typing (out of scope, not part of this finding), it only fixes the wrong data being fetched.

- [ ] **Step 4: This cannot be fully verified end-to-end in this environment**

No live backend is reachable in this sandbox (confirmed throughout this session). Static verification (Steps 1-3) gives strong confidence the fix is structurally correct — the endpoint, response shape, and field names were independently cross-checked against the real backend controller and DTO — but the actual runtime behavior (does `GET /api/v1/question-sets/slug/{slug}` really return a 200 with the right shape for a real slug, does the payment then submit with the correct `questionSetId`/`price`) needs a human to click through this flow against a real running backend before treating this as fully done. State this plainly in your report — do not claim end-to-end success you didn't actually observe.

Leave the change in the working tree — no commit.

---

## Phase 2 — Real bugs, no security implication

### Task 3: Stop referencing a placeholder image that doesn't exist

**Files:**
- Modify: `C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\components\features\blogs\BlogDetailContent.tsx`

**Interfaces:**
- Consumes: `BlogArticle`'s `image: string` prop (`components/features/blogs/BlogArticle.tsx:11`) — a required, non-optional `string`. `BlogArticle` already guards rendering with `{blog.image && (...)}` (line 49), so an empty string is the correct "no image" value for this prop — it satisfies the required `string` type AND is falsy, so the existing guard already does the right thing with it. Do not change `BlogArticle`'s prop type to `string | undefined` — that would be a bigger, unnecessary change than this bug needs.
- Produces: nothing new.

Current:
```tsx
// BlogDetailContent.tsx — current, inside the formattedBlog object
image: blog.imageName 
  ? (blog.imageName.startsWith('http') 
      ? blog.imageName 
      : `https://api.entrancegateway.com/api/v1/resources/${blog.imageName}`)
  : '/placeholder-blog.jpg',
```

- [ ] **Step 1: Re-confirm the placeholder file genuinely doesn't exist and nothing else references it**

Run:
```bash
find C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\public -iname "placeholder-blog*"
grep -rn "placeholder-blog" --include="*.tsx" --include="*.ts" C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway --exclude-dir=node_modules --exclude-dir=.next
```
Expected: no file found; only this one line in `BlogDetailContent.tsx` references the string. If a second reference turns up somewhere else, read that file too before deciding whether this fix should also touch it.

- [ ] **Step 2: Replace the fake path with an empty string**

```tsx
// BlogDetailContent.tsx — after
image: blog.imageName 
  ? (blog.imageName.startsWith('http') 
      ? blog.imageName 
      : `https://api.entrancegateway.com/api/v1/resources/${blog.imageName}`)
  : '',
```

- [ ] **Step 3: Verify TypeScript compiles clean**

Run: `npx tsc --noEmit`
Expected: no errors — `''` satisfies `image: string` on `BlogArticle`.

- [ ] **Step 4: Visually confirm**

Run: `npm run dev`, view any blog post whose `imageName` is empty/null. Expected: no broken-image icon — the article renders with no image block at all (matching `BlogArticle.tsx:49`'s existing `{blog.image && (...)}` guard). If you don't have a real blog post with a missing image to test against (no live backend in this sandbox), note that this step is unverified rather than claiming you saw it render correctly.

Leave the change in the working tree — no commit.

---

### Task 4: Delete the dead, fake-success duplicate of the payment form

**Files:**
- Delete: `C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\components\features\quiz\QuizPaymentPageContent.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing — confirmed unused.

This file is a near-duplicate of `QuizPaymentPage.tsx` (fixed in Task 2) but is never imported by any route. Its own `handleSubmit` does `await new Promise(resolve => setTimeout(resolve, 2000))` then redirects — it silently discards the uploaded receipt file and never calls any API, while presenting a real-looking "submitting payment" UI. Dead code that looks production-ready is worse than no code — a future route wiring mistake could reintroduce a payment form that always fakes success.

- [ ] **Step 1: Re-confirm it's genuinely unused**

Run:
```bash
grep -rn "QuizPaymentPageContent" --include="*.tsx" --include="*.ts" C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway --exclude-dir=node_modules --exclude-dir=.next
```
Expected: only the file's own declaration. If anything in `app/` imports it, STOP — this task's premise is wrong, report what you found instead of deleting a file something depends on.

- [ ] **Step 2: Delete the file**

Delete `components/features/quiz/QuizPaymentPageContent.tsx`.

- [ ] **Step 3: Verify TypeScript compiles clean**

Run: `npx tsc --noEmit`
Expected: no errors (deleting a genuinely unimported file cannot break anything that type-checked before).

Leave the change in the working tree — no commit.

---

### Task 5: Fix the "Change Avatar" button that fakes an upload and does nothing

**Files:**
- Modify: `C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\components\features\profile\ProfileHeader.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new — `ProfileHeader`'s props (`{ userData: User | null }`) are unchanged.

**This is a real decision, not a silent pick — read both options before implementing:**

Current:
```tsx
// ProfileHeader.tsx:13-17 — current
const handleAvatarChange = () => {
  // TODO: Implement avatar upload
  setIsUploading(true)
  setTimeout(() => setIsUploading(false), 1000)
}
```
```tsx
// ProfileHeader.tsx:63-71 — current
<button
  onClick={handleAvatarChange}
  disabled={isUploading}
  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors disabled:opacity-50"
  type="button"
>
  {isUploading ? 'Uploading...' : 'Change Avatar'}
</button>
```

**Option A (this plan's default — implement this unless you have a specific reason to choose B):** disable the button and mark it as coming soon, since a button that runs a fake 1-second spinner and silently does nothing actively misleads the user into thinking something happened.

```tsx
// ProfileHeader.tsx:63-71 — Option A
<button
  disabled
  title="Avatar upload is coming soon"
  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed"
  type="button"
>
  Change Avatar (Coming Soon)
</button>
```
Then remove the now-unused `handleAvatarChange` function and the `isUploading` state (`useState` import stays if `ProfileHeader` uses it elsewhere — check before removing the import itself).

**Option B (only if you have a concrete reason Option A is wrong for this codebase — e.g. a design system convention this plan doesn't know about):** leave the fake spinner as visible "not implemented yet" UI, unchanged. If you choose B, say explicitly why in your report — don't pick it by default, and don't pick it silently.

- [ ] **Step 1: Implement Option A (the default) unless Step 0 gave you a concrete reason to choose B**

Apply the button/handler changes shown above for Option A.

- [ ] **Step 2: Check for now-unused imports/state**

Run:
```bash
grep -n "isUploading\|useState" C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\components\features\profile\ProfileHeader.tsx
```
If `isUploading` (and the `useState` import, if nothing else in the file uses `useState`) are now fully unused, remove them. If something else in the file still uses `useState` for a different piece of state, keep the import and only remove the `isUploading` declaration itself.

- [ ] **Step 3: Verify TypeScript compiles clean**

Run: `npx tsc --noEmit`
Expected: no errors, no unused-variable warnings if this project's `tsconfig`/lint treats those as errors.

Leave the change in the working tree — no commit.

---

## Phase 3 — Cleanup (batch, same-shape work)

### Task 6: Remove `console.log` debug leftovers (keep `console.error` inside real error handlers)

**Files:**
- Modify: `C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\components\features\blogs\BlogDetailContent.tsx`
- Modify: `C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\components\features\notes\NotesDetailContent.tsx`
- Modify: `C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\components\features\questions\QuestionsDetailContent.tsx`
- Modify: `C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\components\features\profile\ProfilePageContent.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing — removing a `console.log` call has no effect on any consumer, by construction (nothing reads a `console.log`'s return value, and none of these are inside a code path whose control flow depends on the call itself).

This is one batched task covering 4 files with the same mechanical change — delete each named `console.log` line, leave every `console.error` line (inside real `catch` blocks) untouched. Exact lines, confirmed by direct read immediately before this plan was written:

- `BlogDetailContent.tsx`: delete lines 21, 22, 23, 24, 38, 103, 104, 105, 106 (all `console.log`). **Keep line 41** (`console.error('Error fetching blog:', err)` — inside a real catch block).
- `NotesDetailContent.tsx`: delete lines 21, 22, 23, 24, 39, 53 (all `console.log`). **Keep line 42** (`console.error`, inside a real catch block).
- `QuestionsDetailContent.tsx`: delete line 49 (`console.log('PDF URL (from pdfFilePath):', question?.pdfFilePath)`).
- `ProfilePageContent.tsx`: delete lines 45, 64, 72, 85 (all `console.log`). **Keep line 76** (`console.error('❌ Failed to update profile:', err)`, inside a real catch block).

- [ ] **Step 1: Re-confirm line numbers before deleting anything**

Line numbers can drift if any other change already landed in these files. Run, for each file:
```bash
grep -n "console\." C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\components\features\blogs\BlogDetailContent.tsx
grep -n "console\." C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\components\features\notes\NotesDetailContent.tsx
grep -n "console\." C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\components\features\questions\QuestionsDetailContent.tsx
grep -n "console\." C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrance-gateway\components\features\profile\ProfilePageContent.tsx
```
Match each hit against the list above by its actual current line number and surrounding text (not blindly by number) before deleting — the text content (`console.log(...)` vs `console.error(...)`, and the message string) is the real identifier, the line numbers are a cross-check.

- [ ] **Step 2: Delete each identified `console.log` line, leave every `console.error` line untouched**

Delete the lines identified in Step 1 as `console.log` calls matching the list above. Do not delete any `console.error` line, and do not delete any surrounding code (blank lines around a deleted `console.log` are fine to leave or collapse — whichever keeps the diff smallest and the file readable, don't fuss over it).

- [ ] **Step 3: Verify TypeScript compiles clean**

Run: `npx tsc --noEmit`
Expected: no errors (deleting a `console.log` statement cannot introduce a type error).

Leave the change in the working tree — no commit.

---

### Task 7: Delete the unused `ToastDemo` example component

**Files:**
- Delete: `C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrancegateway-cms\src\components\examples\ToastDemo.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing — confirmed unused (not imported by any `app/` route). This is also the source of the only two `console.log` hits in this repo's `src/` tree.

- [ ] **Step 1: Re-confirm it's genuinely unused**

Run:
```bash
grep -rn "ToastDemo" --include="*.tsx" --include="*.ts" C:\Users\Dell\IdeaProjects\entrance-gateway-project\entrancegateway-cms --exclude-dir=node_modules --exclude-dir=.next
```
Expected: only the file's own declaration. If anything imports it, STOP and report what you found — don't delete a file something depends on.

- [ ] **Step 2: Delete the file**

Delete `src/components/examples/ToastDemo.tsx`. If `src/components/examples/` is now empty, remove the empty directory too.

- [ ] **Step 3: Verify TypeScript compiles clean**

Run: `npx tsc --noEmit` (from `entrancegateway-cms`)
Expected: no errors.

Leave the change in the working tree — no commit.

---

## Self-Review Notes

- **Coverage:** all 7 audit findings the user asked to fix have a task (2 HIGH → Phase 1, 3 MEDIUM → Phase 2, 2 cleanup items → Phase 3, one of which batches 4 files). The 2 LOW-severity items are explicitly excluded per the Global Constraints, not silently dropped.
- **Placeholder scan:** every step has real, current code (verified by direct file reads immediately before writing this plan, not assumed) and a real command to run. Task 5's "Option A vs B" is a genuine decision point the plan states explicitly, with a stated default and a requirement to justify choosing otherwise — not a vague "handle it appropriately."
- **Type consistency:** Task 2's `fetchQuizBySlug`/`Quiz` interface field names match what Task 2 itself documents from the real backend DTO. Task 3's empty-string fix matches `BlogArticle`'s real, unchanged `image: string` prop type. No task changes a type or signature another task (or existing code) depends on.
- **Cross-repo scope:** Tasks 1 and 7 touch `entrancegateway-cms`; Tasks 2-6 touch `entrance-gateway`. Every task names its repo's full path explicitly — no task assumes "the current repo" implicitly.
- **Honesty about verification limits:** Task 2 explicitly states it cannot be end-to-end verified without a live backend, rather than claiming a false pass. Tasks 3-7 note where a visual/manual check is recommended but may be unverifiable in this sandbox.

---

**Plan complete and saved to `docs/superpowers/plans/2026-09-18-frontend-ui-audit-fixes.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
