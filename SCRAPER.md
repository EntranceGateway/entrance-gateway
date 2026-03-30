# SCRAPER.md

## Scope

This document currently covers:
- **syllabus pages**
- **notes pages**
- **old questions pages**
- **college pages**
- **course pages**
- **blog pages**
- **training pages**
- **quiz pages**

## Core scraper rules

- Treat `data-role` as the primary selector contract.
- Treat `data-detail-uri` as the canonical machine-readable detail URI when present.
- Treat hidden `meta-*` blocks as structured fallback metadata for detail pages.
- Treat `page-title` as reserved for the primary page-level heading only.
- Prefer singular item/link/title naming such as `note-link`, `quiz-title`, `college-item`.
- Use URL query pagination for list enumeration:
  - `?page=1`
  - `?page=2`
  - optional `?size=...`

## Implemented `data-role` values

### Page-level
- `page-title`
- `page-content`
- `description`
- `pagination-status`

### Syllabus list page
- `course-list`
- `course-item`
- `course-name`
- `course-code`
- `affiliation`
- `year`
- `semester-item`
- `semester-name`
- `syllabus-link`
- `subject-code`
- `subject-name`
- `credit-hours`
- `data-detail-uri`

### Syllabus detail page
- `page-title`
- `page-content`
- `course-name`
- `course-code`
- `semester`
- `year`
- `subject-name`
- `credit-hours`
- `lecture-hours`
- `practical-hours`
- `program`
- `meta-subject-info`
- `data-detail-uri`

### Syllabus navigation
- `syllabus-navigation`
- `prev-link`
- `semester-link`
- `next-link`

### Notes list page
- `page-title`
- `page-content`
- `note-list`
- `note-item`
- `note-title`
- `course-code`
- `course-name`
- `semester`
- `year`
- `affiliation`
- `description`
- `note-link`
- `data-detail-uri`

### Notes detail page
- `page-title`
- `page-content`
- `course-name`
- `course-code`
- `semester`
- `year`
- `affiliation`
- `description`
- `meta-note-info`
- `data-detail-uri`

### Old questions list page
- `page-title`
- `page-content`
- `question-list`
- `questions-table`
- `question-row`
- `question-item`
- `question-title`
- `subject-name`
- `year`
- `course-name`
- `affiliation`
- `question-link`
- `data-detail-uri`

### Old questions detail page
- `page-title`
- `page-content`
- `question-title`
- `subject-name`
- `year`
- `course-name`
- `affiliation`
- `description`
- `questions-link`
- `meta-question-info`
- `data-detail-uri`

### Colleges list page
- `page-title`
- `page-content`
- `college-list`
- `college-item`
- `college-name`
- `location`
- `affiliation`
- `course-name`
- `course-count`
- `college-link`
- `data-detail-uri`

### College detail page
- `page-title`
- `page-content`
- `location`
- `affiliation`
- `established-year`
- `college-description`
- `description`
- `course-list`
- `course-item`
- `course-name`
- `course-level`
- `duration`
- `contact-info`
- `website`
- `phone`
- `email`
- `location-map`
- `map-link`
- `latitude`
- `longitude`
- `meta-college-info`
- `meta-college-contact-mobile`
- `data-detail-uri`

### Courses list page
- `page-title`
- `page-content`
- `course-list`
- `course-item`
- `course-name`
- `affiliation`
- `description`
- `course-level`
- `course-type`
- `college-count`
- `data-detail-uri`

### Course detail page
- `page-title`
- `page-content`
- `affiliation`
- `course-level`
- `course-type`
- `course-description`
- `description`
- `admission-criteria`
- `criteria`
- `college-list`
- `college-item`
- `college-name`
- `location`
- `college-count`
- `meta-course-info`
- `data-detail-uri`

### Blogs list page
- `page-title`
- `page-content`
- `blog-list`
- `blog-item`
- `blog-title`
- `category`
- `published-date`
- `description`
- `blog-link`
- `data-detail-uri`

### Blog detail page
- `page-title`
- `page-content`
- `category`
- `published-date`
- `read-time`
- `article-content`
- `blogs-link`
- `meta-blog-info`
- `data-detail-uri`

### Trainings list page
- `page-title`
- `page-content`
- `training-list`
- `training-item`
- `training-name`
- `training-status`
- `category`
- `training-type`
- `duration`
- `price`
- `capacity`
- `location`
- `training-link`
- `data-detail-uri`

### Training detail page
- `page-title`
- `page-content`
- `training-status`
- `category`
- `description`
- `training-type`
- `duration`
- `price`
- `capacity`
- `location`
- `meta-training-info`
- `meta-training-sidebar`
- `data-detail-uri`

### Quiz list page
- `page-title`
- `page-content`
- `quiz-list`
- `quiz-item`
- `quiz-title`
- `course-name`
- `question-count`
- `duration`
- `price`
- `quiz-link`
- `data-detail-uri`

### Quiz detail/start page
- `page-title`
- `page-content`
- `course-name`
- `description`
- `question-count`
- `duration`
- `price`
- `meta-quiz-info`
- `data-detail-uri`

## Selector reference

### General page selectors
- Page wrapper: `[data-role="page-content"]`
- Primary heading: `[data-role="page-title"]`
- Canonical description: `[data-role="description"]`

### Generic list/detail recipes
- List container: `[data-role$="-list"]`
- List item: `[data-role$="-item"]`
- Human title: `[data-role$="-title"], [data-role$="-name"]`
- Link element: `[data-role$="-link"]`
- Canonical detail URI: `[data-detail-uri]`
- Hidden metadata: `[data-role^="meta-"]`

### Module-specific list selectors

| Module | List selector | Item selector | Title selector | Link selector | Detail URI source |
| --- | --- | --- | --- | --- | --- |
| Syllabus | `[data-role="course-list"]` | `[data-role="semester-item"]`, `[data-role="course-item"]` | `[data-role="course-name"]`, `[data-role="subject-name"]` | `[data-role="syllabus-link"]` | `data-detail-uri` |
| Notes | `[data-role="note-list"]` | `[data-role="note-item"]` | `[data-role="note-title"]` | `[data-role="note-link"]` | `data-detail-uri` |
| Old Questions | `[data-role="question-list"]` | `[data-role="question-item"], [data-role="question-row"]` | `[data-role="question-title"]` | `[data-role="question-link"]` | `data-detail-uri` |
| Colleges | `[data-role="college-list"]` | `[data-role="college-item"]` | `[data-role="college-name"]` | `[data-role="college-link"]` | `data-detail-uri` |
| Courses | `[data-role="course-list"]` | `[data-role="course-item"]` | `[data-role="course-name"]` | item itself may be the link | `data-detail-uri` |
| Blogs | `[data-role="blog-list"]` | `[data-role="blog-item"]` | `[data-role="blog-title"]` | `[data-role="blog-link"]` | `data-detail-uri` |
| Trainings | `[data-role="training-list"]` | `[data-role="training-item"]` | `[data-role="training-name"]` | `[data-role="training-link"]` | `data-detail-uri` |
| Quiz | `[data-role="quiz-list"]` | `[data-role="quiz-item"]` | `[data-role="quiz-title"]` | `[data-role="quiz-link"]` | `data-detail-uri` |

### Module-specific detail metadata selectors

| Module | Primary metadata selector |
| --- | --- |
| Syllabus | `[data-role="meta-subject-info"]` |
| Notes | `[data-role="meta-note-info"]` |
| Old Questions | `[data-role="meta-question-info"]` |
| Colleges | `[data-role="meta-college-info"]`, `[data-role="meta-college-contact-mobile"]` |
| Courses | `[data-role="meta-course-info"]` |
| Blogs | `[data-role="meta-blog-info"]` |
| Trainings | `[data-role="meta-training-info"]`, `[data-role="meta-training-sidebar"]` |
| Quiz | `[data-role="meta-quiz-info"]` |

## Scraper profile mapping

### 1. List crawler profile
Use when enumerating entities and collecting detail URLs.

Recommended strategy:
1. Request page 1.
2. Read `[data-role="page-content"]`.
3. Read the module list container.
4. For each item, extract:
   - title/name
   - summary fields
   - `data-detail-uri`
5. Move through `?page=2`, `?page=3`, etc. until:
   - no items remain, or
   - `pagination-status` says last page has been reached.

### 2. Detail crawler profile
Use when high-fidelity detail extraction is required.

Recommended strategy:
1. Fetch canonical detail URL.
2. Extract `[data-role="page-title"]`.
3. Extract visible fields first.
4. Merge hidden `meta-*` data for normalization.
5. Preserve `data-detail-uri` as canonical identifier if exposed.

### 3. Metadata-first crawler profile
Use when low-bandwidth extraction is preferred.

Recommended strategy:
1. Fetch detail page.
2. Read `[data-role^="meta-"]` first.
3. Use visible fields only when metadata does not expose a needed field.

### 4. SSR-only crawler profile
Use for bots that do not execute JavaScript.

Recommended strategy:
1. Fetch raw HTML only.
2. Depend exclusively on server-rendered `data-role`, `data-detail-uri`, and `meta-*` markup.
3. Enumerate pages via `?page=` instead of in-browser interactions.

### 5. Browser-assisted crawler profile
Use when validating client transitions or interactive pagination.

Recommended strategy:
1. Load the initial page in a browser.
2. Interact with next/previous pagination controls if desired.
3. Confirm the URL updates to `?page=N`.
4. Re-read the DOM and ensure roles remain stable after navigation.

## Role priority matrix

| Need | Priority 1 | Priority 2 | Priority 3 |
| --- | --- | --- | --- |
| Page title | `page-title` | module `*-title` on detail page | document `<title>` |
| Entity title | module `*-title` or `*-name` | text inside detail link/item | hidden `meta-*` attributes/text |
| Detail URI | `data-detail-uri` | href on `*-link` | inferred route from slug/id |
| Description | visible `[data-role="description"]` | module-specific description role | hidden `meta-*` |
| Category/type/status | visible module role | hidden `meta-*` | plain text fallback |
| Counts/duration/price | visible module role | hidden `meta-*` | plain text fallback |

### Additional precedence rules
- `page-title` must only represent the main page heading.
- Prefer entity-specific roles such as `note-title`, `question-title`, and `quiz-title` for non-page headings.
- Prefer canonical `data-detail-uri` over client navigation logic or guessed slugs.
- Prefer hidden `meta-*` blocks over scraping incidental sidebar text when both exist.
- Prefer singular role naming in any new implementation.

## Pagination discovery guidance

### Supported strategy
List enumeration is standardized on query-parameter pagination.

Supported pattern:
- `?page=1`
- `?page=2`
- optional `?size=9`, `?size=10`, `?size=12`

### Current SSR defaults by module

| Module | Route | Default size |
| --- | --- | --- |
| Notes | `/notes` | `9` |
| Old Questions | `/questions` | `10` |
| Blogs | `/blogs` | `10` |
| Trainings | `/trainings` | `12` |
| Quiz | `/quiz` | `12` |
| Courses | `/courses` | `10` |

### Recommended enumeration algorithm
1. Start with `?page=1`.
2. Extract all list items.
3. Record each `data-detail-uri`.
4. If `[data-role="pagination-status"]` exists, parse current and total pages.
5. Continue until current page equals total pages.
6. If `pagination-status` is missing, continue until a page returns zero items.

## Verification

### SSR verification checklist
For every list page, confirm the server-rendered HTML includes:
- exactly one `[data-role="page-title"]`
- one `[data-role="page-content"]`
- the expected module list role
- item-level roles
- `data-detail-uri` on list items or links
- pagination discoverability via URL parameters

### Manual curl examples
```bash
curl -s 'http://localhost:3000/notes?page=2' | grep -o 'data-role="note-list"'
curl -s 'http://localhost:3000/questions?page=2' | grep -o 'data-role="question-list"'
curl -s 'http://localhost:3000/blogs?page=2' | grep -o 'data-role="blog-list"'
curl -s 'http://localhost:3000/trainings?page=2' | grep -o 'data-role="training-list"'
curl -s 'http://localhost:3000/quiz?page=2' | grep -o 'data-role="quiz-list"'
curl -s 'http://localhost:3000/courses?page=2' | grep -o 'data-role="course-list"'
```

### Example Python SSR smoke check
```python
import re
import urllib.request

routes = [
    ('notes', 'note-list'),
    ('questions', 'question-list'),
    ('blogs', 'blog-list'),
    ('trainings', 'training-list'),
    ('quiz', 'quiz-list'),
    ('courses', 'course-list'),
]

for route, role in routes:
    html = urllib.request.urlopen(f'http://localhost:3000/{route}?page=1').read().decode()
    page_titles = len(re.findall(r'data-role="page-title"', html))
    has_page_content = 'data-role="page-content"' in html
    has_list_role = f'data-role="{role}"' in html
    has_detail_uri = 'data-detail-uri=' in html
    print(route, page_titles, has_page_content, has_list_role, has_detail_uri)
```

Expected result:
- `page_titles == 1`
- `has_page_content == True`
- `has_list_role == True`
- `has_detail_uri == True`

### Browser verification
In DevTools, use the existing debug helper where available:
```js
window.debug_page_structure?.()
```

Confirm:
- role inventory is stable after pagination changes
- URL updates to `?page=N`
- the DOM still contains list/item/detail-uri annotations after navigation

## Notes
- Course codes are wrapped with `<code>` where implemented.
- Main content areas use semantic `<main>`, `<section>`, and `<article>` where relevant.
- Hidden scraper metadata is exposed using:
  - `<span class="sr-only" data-role="meta-subject-info" ... />`
  - `<span class="sr-only" data-role="meta-note-info" ... />`
  - `<span class="sr-only" data-role="meta-question-info" ... />`
  - `<span class="sr-only" data-role="meta-college-info" ... />`
  - `<span class="sr-only" data-role="meta-college-contact-mobile" ... />`
  - `<span class="sr-only" data-role="meta-course-info" ... />`
  - `<span class="sr-only" data-role="meta-blog-info" ... />`
  - `<span class="sr-only" data-role="meta-training-info" ... />`
  - `<span class="sr-only" data-role="meta-training-sidebar" ... />`
  - `<span class="sr-only" data-role="meta-quiz-info" ... />`
- For syllabus, notes, old questions, colleges, courses, blogs, trainings, and quizzes, the detail page URI is exposed explicitly with `data-detail-uri` on list links/items and hidden metadata blocks where available.
- This file intentionally documents the current production selector contract and verification workflow.
