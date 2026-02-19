import { DETECTED_COLORS } from '@/components/DataTableComponents/utils'

describe('DataTableComponents utils', () => {
  it('exports detected colors map', () => {
    expect(DETECTED_COLORS.running).toBe('#2196F3')
    expect(DETECTED_COLORS.finished).toBe('#43A047')
    expect(DETECTED_COLORS.offline).toBe('#F56C6C')
    expect(DETECTED_COLORS['network error']).toBe('#F56C6C')
  })
})
