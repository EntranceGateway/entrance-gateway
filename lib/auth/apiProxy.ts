import { getValidTokenOrRefresh } from '@/lib/auth/token'

export interface AuthenticatedFetchResult {
  response: Response | null
  accessToken: string | null
}

export async function fetchWithAuthRetry(
  input: string | URL,
  init: RequestInit = {}
): Promise<AuthenticatedFetchResult> {
  let accessToken = await getValidTokenOrRefresh()

  if (!accessToken) {
    return { response: null, accessToken: null }
  }

  let response = await fetch(input, withAuthorization(init, accessToken))

  if (response.status === 401 || response.status === 403) {
    accessToken = await getValidTokenOrRefresh({ forceRefresh: true })

    if (accessToken) {
      response = await fetch(input, withAuthorization(init, accessToken))
    }
  }

  return { response, accessToken }
}

function withAuthorization(init: RequestInit, accessToken: string): RequestInit {
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${accessToken}`)

  return {
    ...init,
    headers,
  }
}
