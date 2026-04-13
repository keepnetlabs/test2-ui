import TrainingLibraryFirstCardSettings from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCardSettings.vue'

describe('TrainingLibraryFirstCardSettings.vue (extra)', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('toggleIsSettingsOpened marks first-open state and clears it after the timeout', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
    const ctx = {
      isSettingsOpened: false,
      isFirstOpenSettings: false,
      firstOpenSettingsTimeout: null
    }

    TrainingLibraryFirstCardSettings.methods.toggleIsSettingsOpened.call(ctx)

    expect(ctx.isSettingsOpened).toBe(true)
    expect(ctx.isFirstOpenSettings).toBe(true)
    expect(clearTimeoutSpy).not.toHaveBeenCalled()

    jest.advanceTimersByTime(200)

    expect(ctx.isFirstOpenSettings).toBe(false)
  })

  it('toggleIsSettingsOpened clears a previous timeout before scheduling a new one', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
    const ctx = {
      isSettingsOpened: true,
      isFirstOpenSettings: false,
      firstOpenSettingsTimeout: 123
    }

    TrainingLibraryFirstCardSettings.methods.toggleIsSettingsOpened.call(ctx)

    expect(clearTimeoutSpy).toHaveBeenCalledWith(123)
    expect(ctx.isSettingsOpened).toBe(false)
  })

  it('beforeDestroy clears an existing timeout', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

    TrainingLibraryFirstCardSettings.beforeDestroy.call({
      firstOpenSettingsTimeout: 999
    })

    expect(clearTimeoutSpy).toHaveBeenCalledWith(999)
  })
})
