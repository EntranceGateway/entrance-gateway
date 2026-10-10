import test from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { isJwtExpired } from '../lib/auth/expiry'
import { proxy } from '../proxy'
const token = (exp: number) => `e30.${Buffer.from(JSON.stringify({exp})).toString('base64url')}.signature`
test('malformed, missing-expiry and expired tokens fail closed', () => {
  for (const value of ['garbage', 'a.e30.b', token(1)]) assert.equal(isJwtExpired(value), true)
  assert.equal(isJwtExpired(token(Math.floor(Date.now()/1000)+3600)), false)
})
test('refresh on a public SSR page forwards the new cookie to the same request', async () => {
  const original = globalThis.fetch
  const fresh = token(Math.floor(Date.now()/1000)+3600)
  globalThis.fetch = async () => Response.json({data:{accessToken:fresh,expiresIn:3600}})
  try {
    const response = await proxy(new NextRequest('http://localhost:3000/', {headers:{cookie:'refreshToken=valid-refresh'}}))
    assert.equal(response.cookies.get('accessToken')?.value, fresh)
    assert.match(response.headers.get('x-middleware-request-cookie') || '', new RegExp(fresh.replaceAll('.', '\\.')))
  } finally {globalThis.fetch=original}
})
test('a temporary backend outage keeps refresh credentials for retry', async () => {
  const original=globalThis.fetch
  globalThis.fetch=async()=>new Response('',{status:503})
  try {
    const response=await proxy(new NextRequest('http://localhost:3000/',{headers:{cookie:'refreshToken=valid-refresh'}}))
    assert.equal(response.headers.get('set-cookie'),null)
  } finally {globalThis.fetch=original}
})
