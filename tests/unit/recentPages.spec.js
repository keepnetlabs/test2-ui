import { getRecentPageNames, recordRecentPage } from '@/utils/recentPages'

const KEY = 'commandPalette.recentPages'

describe('recentPages', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns an empty list when nothing is stored', () => {
    expect(getRecentPageNames()).toEqual([])
  })

  it('records a page as most-recent', () => {
    recordRecentPage('Dashboard')
    expect(getRecentPageNames()).toEqual(['Dashboard'])
  })

  it('prepends newest first', () => {
    recordRecentPage('Dashboard')
    recordRecentPage('Reports')
    expect(getRecentPageNames()).toEqual(['Reports', 'Dashboard'])
  })

  it('dedupes — re-recording moves the page to the front', () => {
    recordRecentPage('Dashboard')
    recordRecentPage('Reports')
    recordRecentPage('Dashboard')
    expect(getRecentPageNames()).toEqual(['Dashboard', 'Reports'])
  })

  it('caps the list at 5 entries', () => {
    ;['A', 'B', 'C', 'D', 'E', 'F'].forEach(recordRecentPage)
    const names = getRecentPageNames()
    expect(names).toHaveLength(5)
    expect(names).toEqual(['F', 'E', 'D', 'C', 'B'])
  })

  it('ignores empty / non-string names', () => {
    recordRecentPage('Dashboard')
    recordRecentPage('')
    recordRecentPage(null)
    recordRecentPage(123)
    expect(getRecentPageNames()).toEqual(['Dashboard'])
  })

  it('degrades to [] on a corrupt stored value', () => {
    localStorage.setItem(KEY, '{not json')
    expect(getRecentPageNames()).toEqual([])
  })

  it('filters out non-string entries from a tampered store', () => {
    localStorage.setItem(KEY, JSON.stringify(['Dashboard', 42, null, 'Reports']))
    expect(getRecentPageNames()).toEqual(['Dashboard', 'Reports'])
  })
})
