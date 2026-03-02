import { useLoading } from '@/hooks/useLoading'

describe('useLoading (extra branch coverage)', () => {
  it('setLoading sets isLoading to true when called with true', () => {
    const ctx = { isLoading: false }
    useLoading.methods.setLoading.call(ctx, true)
    expect(ctx.isLoading).toBe(true)
  })

  it('setLoading sets isLoading to false when called with false', () => {
    const ctx = { isLoading: true }
    useLoading.methods.setLoading.call(ctx, false)
    expect(ctx.isLoading).toBe(false)
  })

  it('setLoading defaults to false when called with no args', () => {
    const ctx = { isLoading: true }
    useLoading.methods.setLoading.call(ctx)
    expect(ctx.isLoading).toBe(false)
  })

  it('data returns isLoading false by default', () => {
    const data = useLoading.data()
    expect(data.isLoading).toBe(false)
  })
})
