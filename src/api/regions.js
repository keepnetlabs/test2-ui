import testRequest from '../utils/testRequest'

export function getRegions(options = {}) {
  const { loading = false } = options
  return testRequest.get('/regions', { loading })
}
