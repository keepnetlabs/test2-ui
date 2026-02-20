import Widgets from '@/views/Widgets.vue'
import { postWidgets } from '@/api/widgets'

jest.mock('@/api/widgets', () => ({
  postWidgets: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

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

  it('closePlaybookWithUpdate calls callback and closes modal', () => {
    const ctx = {
      callbackOfPlaybook: jest.fn(),
      togglePlaybookModal: jest.fn()
    }

    Widgets.methods.closePlaybookWithUpdate.call(ctx)
    expect(ctx.callbackOfPlaybook).toHaveBeenCalled()
    expect(ctx.togglePlaybookModal).toHaveBeenCalled()
  })

  it('breakpointChanged updates positions and resizes AgenticAI widget on xs', () => {
    const ctx = {
      activeBreakpoint: 'lg',
      layout: [
        { key: 'RecentCampaigns', x: 4, y: 1, w: 4, h: 3, defaultW: 4, midW: 6 },
        { key: 'AgenticAIStatusWidget', x: 0, y: 0, w: 8, h: 3, defaultW: 6, midW: 5 }
      ],
      getBdCol: Widgets.methods.getBdCol
    }

    Widgets.methods.breakpointChanged.call(ctx, { newBreakpoint: 'xs' })

    const agenticWidget = ctx.layout.find((item) => item.key === 'AgenticAIStatusWidget')
    expect(ctx.activeBreakpoint).toBe('xs')
    expect(agenticWidget.w).toBe(5)
    expect(ctx.layout[0].x).toBe(0)
  })

  it('deleteWidget removes layout item and returns it to available list', () => {
    const ctx = {
      layout: [{ key: 'A' }, { key: 'B' }],
      availableWidgets: []
    }
    Widgets.methods.deleteWidget.call(ctx, { key: 'A', title: 'Widget A', isAllowed: true }, 0)
    expect(ctx.layout).toEqual([{ key: 'B' }])
    expect(ctx.availableWidgets).toEqual([{ key: 'A', name: 'Widget A', isAllowed: true }])
  })

  it('removeAvailableWidget removes widget by key', () => {
    const ctx = {
      availableWidgets: [{ key: 'A' }, { key: 'B' }]
    }
    Widgets.methods.removeAvailableWidget.call(ctx, { key: 'A' })
    expect(ctx.availableWidgets).toEqual([{ key: 'B' }])
  })

  it('addWidget sets width to 6 on narrow screens and appends to layout', () => {
    const originalInnerWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      value: 1000,
      configurable: true
    })
    const ctx = {
      newItemY: 2,
      layout: [],
      allWidgets: {
        RecentCampaigns: { key: 'RecentCampaigns', w: 3, defaultW: 3, h: 6 }
      },
      removeAvailableWidget: jest.fn()
    }

    Widgets.methods.addWidget.call(ctx, { key: 'RecentCampaigns' })
    expect(ctx.removeAvailableWidget).toHaveBeenCalledWith({ key: 'RecentCampaigns' })
    expect(ctx.layout[0].w).toBe(6)
    expect(ctx.newItemY).toBe(8)

    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      configurable: true
    })
  })

  it('handleCancelEditMode restores initial layout and available widgets', () => {
    const ctx = {
      availableWidgets: [{ key: 'X' }],
      initialAvailableWidgets: [{ key: 'A' }],
      layout: [{ key: 'Y' }],
      initialLayout: [{ key: 'B' }],
      editMode: true
    }

    Widgets.methods.handleCancelEditMode.call(ctx)
    expect(ctx.availableWidgets).toEqual([{ key: 'A' }])
    expect(ctx.layout).toEqual([{ key: 'B' }])
    expect(ctx.editMode).toBe(false)
  })

  it('callForPostWidgets posts simplified payload and closes edit mode', async () => {
    const ctx = {
      editMode: true,
      layout: [
        { x: 0, y: 1, w: 2, h: 3, title: 'A', key: 'WidgetA', extra: 'ignore' }
      ]
    }
    Widgets.methods.callForPostWidgets.call(ctx)
    await flushPromises()

    expect(postWidgets).toHaveBeenCalledWith({
      settings: [{ x: 0, y: 1, w: 2, h: 3, title: 'A', key: 'WidgetA' }]
    })
    expect(ctx.editMode).toBe(false)
  })

  it('handleSaveChanges calls shadow cleanup and post flow', () => {
    const ctx = {
      handleDeleteShadows: jest.fn(),
      callForPostWidgets: jest.fn()
    }
    Widgets.methods.handleSaveChanges.call(ctx)
    expect(ctx.handleDeleteShadows).toHaveBeenCalled()
    expect(ctx.callForPostWidgets).toHaveBeenCalled()
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
