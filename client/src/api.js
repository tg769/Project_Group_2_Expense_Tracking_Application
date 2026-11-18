export const API_URL = 'http://localhost:5001/api'

// Small helper for calling the API. Returns the JSON from the server, or
// throws an Error with the message the server sent back.
export async function apiRequest(path, method = 'GET', body) {
  const options = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) {
    options.body = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(API_URL + path, options)
  } catch {
    throw new Error('Could not reach the server. Is it running?')
  }

  // DELETE returns 204 with no body
  if (res.status === 204) {
    return null
  }

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong.')
  }
  return data
}
