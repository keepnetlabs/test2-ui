import TrainingLibraryFirstCardSettings from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCardSettings.vue'

describe('TrainingLibraryFirstCardSettings.vue', () => {
  it('toggleIsSettingsOpened toggles isSettingsOpened', () => {
    const ctx = { isSettingsOpened: false }
    TrainingLibraryFirstCardSettings.methods.toggleIsSettingsOpened.call(ctx)
    expect(ctx.isSettingsOpened).toBe(true)
    TrainingLibraryFirstCardSettings.methods.toggleIsSettingsOpened.call(ctx)
    expect(ctx.isSettingsOpened).toBe(false)
  })

  it('handleSettingsPopupClickOutside closes when not first open', () => {
    const ctx = { isSettingsOpened: true, isFirstOpenSettings: false }
    TrainingLibraryFirstCardSettings.methods.handleSettingsPopupClickOutside.call(ctx)
    expect(ctx.isSettingsOpened).toBe(false)
  })

  it('handleSettingsPopupClickOutside does not close when first open', () => {
    const ctx = { isSettingsOpened: true, isFirstOpenSettings: true }
    TrainingLibraryFirstCardSettings.methods.handleSettingsPopupClickOutside.call(ctx)
    expect(ctx.isSettingsOpened).toBe(true)
  })
})
