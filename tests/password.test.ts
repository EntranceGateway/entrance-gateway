import test from 'node:test'
import assert from 'node:assert/strict'
import { POST } from '../app/api/auth/password/[action]/route'

test('password reset forwards only the two intended endpoints and preserves backend errors', async () => {
  const original = globalThis.fetch
  const paths: string[] = []
  globalThis.fetch = async (url, options) => {
    paths.push(String(url))
    assert.equal(options?.method, 'POST')
    return Response.json({ message: 'Invalid reset code' }, { status: 400 })
  }
  try {
    for (const action of ['request', 'reset']) {
      const response = await POST(new Request('http://localhost', { method: 'POST', body: '{}' }), { params: Promise.resolve({ action }) })
      assert.equal(response.status, 400)
      assert.deepEqual(await response.json(), { error: 'Invalid reset code' })
    }
    assert(paths[0].endsWith('/api/v1/user/forgot-password'))
    assert(paths[1].endsWith('/api/v1/user/reset-password'))
    assert.equal((await POST(new Request('http://localhost'), { params: Promise.resolve({ action: 'admin' }) })).status, 404)
    assert.equal((await POST(new Request('http://localhost', { method: 'POST', body: '{' }), { params: Promise.resolve({ action: 'reset' }) })).status, 400)
    globalThis.fetch = async () => { throw new Error('offline') }
    assert.equal((await POST(new Request('http://localhost', { method: 'POST', body: '{}' }), { params: Promise.resolve({ action: 'reset' }) })).status, 503)
  } finally { globalThis.fetch = original }
})
