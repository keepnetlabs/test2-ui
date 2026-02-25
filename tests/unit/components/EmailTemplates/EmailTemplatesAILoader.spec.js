import EmailTemplatesAILoader from '@/components/EmailTemplates/EmailTemplatesAILoader.vue'

describe('EmailTemplatesAILoader.vue', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('has correct component name', () => {
    expect(EmailTemplatesAILoader.name).toBe('EmailTemplatesAILoader')
  })

  it('defines expected default props', () => {
    expect(EmailTemplatesAILoader.props.title.default).toBe(
      'AI Ally is carefully crafting your Email template'
    )
    expect(EmailTemplatesAILoader.props.description.default).toBe(
      'This process may take approximately 20 seconds. Please stay on the page during this time.'
    )
    expect(EmailTemplatesAILoader.props.loaderTime.default).toBe(20)
    expect(EmailTemplatesAILoader.props.isLoadingFinished.default).toBe(false)
  })

  it('initializes data with timeoutId null and activeLoaderWidth 0', () => {
    const data = EmailTemplatesAILoader.data()
    expect(data.timeoutId).toBeNull()
    expect(data.activeLoaderWidth).toBe(0)
  })

  it('handleActiveLoader increases width and caps at 99 while not finished', () => {
    const ctx = {
      loaderTime: 20,
      isLoadingFinished: false,
      activeLoaderWidth: 98,
      timeoutId: null
    }

    EmailTemplatesAILoader.methods.handleActiveLoader.call(ctx)
    jest.advanceTimersByTime(1000)

    expect(ctx.activeLoaderWidth).toBe(99)
    clearInterval(ctx.timeoutId)
  })

  it('handleActiveLoader sets width to 100 when loading is finished', () => {
    const ctx = {
      loaderTime: 20,
      isLoadingFinished: true,
      activeLoaderWidth: 40,
      timeoutId: null
    }

    EmailTemplatesAILoader.methods.handleActiveLoader.call(ctx)
    jest.advanceTimersByTime(1000)

    expect(ctx.activeLoaderWidth).toBe(100)
    clearInterval(ctx.timeoutId)
  })

  it('created hook triggers handleActiveLoader', () => {
    const ctx = { handleActiveLoader: jest.fn() }
    EmailTemplatesAILoader.created.call(ctx)
    expect(ctx.handleActiveLoader).toHaveBeenCalledTimes(1)
  })
})
