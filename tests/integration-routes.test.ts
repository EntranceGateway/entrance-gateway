import test from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { GET as quizList } from '../app/api/quiz/route'
import { GET as quizDetail } from '../app/api/quiz/[id]/route'
import { GET as quizSlug } from '../app/api/quiz/slug/[slug]/route'
import { GET as oldQuestionSlug } from '../app/api/questions/slug/[slug]/route'
import { fetchQuizBySlug, fetchQuizzes } from '../services/client/quiz.client'
import { fetchResourcePreview } from '../services/api/resources'
import { GET as notes } from '../app/api/notes/route'

test('quiz and old-question proxy routes use the backend catalogue contracts', async () => {
  const original = globalThis.fetch
  let url = ''
  globalThis.fetch = async input => { url = String(input); return Response.json({ data: { questionSetId: 9 } }) }
  const request = new NextRequest('http://localhost/api/quiz?page=2')
  try {
    await quizList(request); assert.match(url, /\/api\/v1\/question-sets\?page=2$/)
    await quizDetail(request, { params: Promise.resolve({ id: '9' }) }); assert.match(url, /\/api\/v1\/question-sets\/9$/)
    await quizSlug(request, { params: Promise.resolve({ slug: 'sample' }) }); assert.match(url, /\/api\/v1\/question-sets\/slug\/sample$/)
    await oldQuestionSlug(request, { params: Promise.resolve({ slug: 'sample' }) }); assert.match(url, /\/api\/v1\/old-question-collections\/slug\/sample$/)
    await notes(new NextRequest('http://localhost/api/notes?courseName=Course%20A&semester=2&affiliation=TRIBHUVAN_UNIVERSITY'))
    const noteUrl = new URL(url)
    assert.equal(noteUrl.searchParams.get('sortBy'), 'noteName')
    assert.equal(noteUrl.searchParams.get('courseName'), 'Course A')
    assert.equal(noteUrl.searchParams.get('semester'), '2')
    assert.equal(noteUrl.searchParams.get('affiliation'), 'TRIBHUVAN_UNIVERSITY')
    assert.equal((await fetchQuizBySlug('sample name')).data.questionSetId, 9)
    assert.equal(url, '/api/quiz/slug/sample%20name')
    await fetchQuizzes({ page: 2 }); assert.match(url, /^\/api\/quiz\?page=2&/)
    globalThis.fetch = async () => new Response('', { status: 404 })
    await assert.rejects(fetchQuizBySlug('missing'), /Failed to fetch quiz/)
  } finally { globalThis.fetch = original }
})

test('file previews use the application proxy and encode file names', async () => {
  const original = globalThis.fetch
  let url = ''
  globalThis.fetch = async input => { url = String(input); return new Response(new Uint8Array([0, 255]), { headers: { 'content-type': 'application/pdf' } }) }
  try {
    const preview = await fetchResourcePreview('name #1.pdf')
    assert.equal(url, '/api/resources/name%20%231.pdf')
    assert.deepEqual(new Uint8Array(await preview.blob.arrayBuffer()), new Uint8Array([0, 255]))
    URL.revokeObjectURL(preview.url)
    const signed = 'https://files.example.invalid/name.pdf?signature=preserve%2Fthis'
    const signedPreview = await fetchResourcePreview(signed)
    assert.equal(url, signed)
    URL.revokeObjectURL(signedPreview.url)
  } finally { globalThis.fetch = original }
})
