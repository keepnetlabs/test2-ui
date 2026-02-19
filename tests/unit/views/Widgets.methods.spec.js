import Widgets from '@/views/Widgets.vue'

describe('views/Widgets.vue methods', () => {
  it('getBdCol returns expected column size by breakpoint', () => {
    expect(Widgets.methods.getBdCol('xs')).toBe(6)
    expect(Widgets.methods.getBdCol('xxs')).toBe(2)
    expect(Widgets.methods.getBdCol('lg')).toBe(12)
  })

  it('togglePlaybookModal toggles modal state', () => {
    const ctx = { showPlaybookModal: false }
    Widgets.methods.togglePlaybookModal.call(ctx)
    expect(ctx.showPlaybookModal).toBe(true)
    Widgets.methods.togglePlaybookModal.call(ctx)
    expect(ctx.showPlaybookModal).toBe(false)
  })

  it('handleSelectedPlaybook stores id/callback and opens modal', () => {
    const ctx = {
      selectedPlaybookId: null,
      callbackOfPlaybook: null,
      togglePlaybookModal: jest.fn()
    }
    const callback = jest.fn()

    Widgets.methods.handleSelectedPlaybook.call(ctx, { resourceId: 'p-1', callback })

    expect(ctx.selectedPlaybookId).toBe('p-1')
    expect(ctx.callbackOfPlaybook).toBe(callback)
    expect(ctx.togglePlaybookModal).toHaveBeenCalled()
  })

  it('ensureAgenticAIWidget does nothing outside test environment', () => {
    const layout = [{ key: 'RecentCampaigns' }]
    const ctx = {
      isTestEnvironment: false,
      removeAvailableWidget: jest.fn(),
      availableWidgets: [{ key: 'AgenticAIStatusWidget' }],
      allWidgets: { AgenticAIStatusWidget: { key: 'AgenticAIStatusWidget' } }
    }

    Widgets.methods.ensureAgenticAIWidget.call(ctx, layout)

    expect(ctx.removeAvailableWidget).not.toHaveBeenCalled()
    expect(layout).toEqual([{ key: 'RecentCampaigns' }])
  })

  it('ensureAgenticAIWidget prepends widget in test environment when missing', () => {
    const layout = [{ key: 'RecentCampaigns', x: 1, y: 1 }]
    const ctx = {
      isTestEnvironment: true,
      removeAvailableWidget: jest.fn(),
      availableWidgets: [{ key: 'AgenticAIStatusWidget' }, { key: 'RecentCampaigns' }],
      allWidgets: {
        AgenticAIStatusWidget: {
          key: 'AgenticAIStatusWidget',
          defaultW: 6,
          midW: 6,
          h: 6
        }
      }
    }

    Widgets.methods.ensureAgenticAIWidget.call(ctx, layout)

    expect(ctx.removeAvailableWidget).toHaveBeenCalledWith({ key: 'AgenticAIStatusWidget' })
    expect(layout[0].key).toBe('AgenticAIStatusWidget')
    expect(ctx.availableWidgets.find((w) => w.key === 'AgenticAIStatusWidget')).toBeUndefined()
  })
})
