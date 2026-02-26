import Widgets from '@/views/Widgets.vue'

describe('views/Widgets.vue (extra)', () => {
  const { methods } = Widgets

  it('handleOpenMenu and handleEditMode update edit state and snapshot available widgets', () => {
    const ctx = {
      editMode: false,
      availableWidgets: [{ key: 'A' }],
      initialAvailableWidgets: []
    }
    methods.handleOpenMenu.call(ctx)
    expect(ctx.editMode).toBe(true)

    ctx.editMode = false
    methods.handleEditMode.call(ctx)
    expect(ctx.editMode).toBe(true)
    expect(ctx.initialAvailableWidgets).toEqual([{ key: 'A' }])
  })

  it('layoutMounted calls shadow cleanup', () => {
    const ctx = { handleDeleteShadows: jest.fn() }
    methods.layoutMounted.call(ctx)
    expect(ctx.handleDeleteShadows).toHaveBeenCalledTimes(1)
  })

  it('breakpointChanged keeps default width for AgenticAI widget on lg', () => {
    const ctx = {
      activeBreakpoint: 'sm',
      layout: [{ key: 'AgenticAIStatusWidget', x: 0, y: 0, w: 5, h: 3, defaultW: 6, midW: 6 }],
      getBdCol: methods.getBdCol
    }
    methods.breakpointChanged.call(ctx, { newBreakpoint: 'lg' })
    expect(ctx.activeBreakpoint).toBe('lg')
    expect(ctx.layout[0].w).toBe(6)
  })

  it('collapse toggles widget body display and height both directions', () => {
    const bodyStyle = { display: 'block' }
    const ctx = {
      layout: [{ key: 'RecentCampaigns', h: 6 }, { key: 'RecentCampaigns', h: 1 }],
      allWidgets: { RecentCampaigns: { defaultH: 6 } },
      $refs: { refRecentCampaigns: [{ $el: { querySelector: () => ({ style: bodyStyle }) } }] }
    }
    methods.collapse.call(ctx, { key: 'RecentCampaigns' }, 0, 'refRecentCampaigns')
    expect(ctx.layout[0].h).toBe(1)
    expect(bodyStyle.display).toBe('none')

    methods.collapse.call(ctx, { key: 'RecentCampaigns' }, 1, 'refRecentCampaigns')
    expect(ctx.layout[1].h).toBe(6)
    expect(bodyStyle.display).toBe('block')
  })

  it('getComponent returns undefined for unknown key and known component for mapped key', () => {
    expect(methods.getComponent.call({}, 'UnknownWidget')).toBeUndefined()
    expect(methods.getComponent.call({}, 'RecentCampaigns')).toBeDefined()
  })

  it('handleDeleteShadows and handleAddShadows mutate element styles/titles', () => {
    const smartWidget = {
      style: { boxShadow: 'a', backgroundColor: 'b', border: 'c' },
      setAttribute: jest.fn()
    }
    const gridItem = { setAttribute: jest.fn() }
    const originalQuerySelectorAll = document.querySelectorAll
    document.querySelectorAll = jest.fn((selector) => {
      if (selector === '.smartwidget') return [smartWidget]
      if (selector === '.vue-grid-item') return [gridItem]
      return []
    })

    methods.handleDeleteShadows.call({})
    expect(smartWidget.style.boxShadow).toBe('none')
    expect(smartWidget.style.backgroundColor).toBe('transparent')
    expect(smartWidget.style.border).toBe('none')

    methods.handleAddShadows.call({})
    expect(smartWidget.style.boxShadow).toBe('')
    expect(smartWidget.style.backgroundColor).toBe('')
    expect(smartWidget.style.border).toBe('')

    document.querySelectorAll = originalQuerySelectorAll
  })

  it('addWidget uses default width on wide screens', () => {
    const originalInnerWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', { value: 1400, configurable: true })
    const ctx = {
      newItemY: 0,
      layout: [],
      allWidgets: {
        Reporters: { key: 'Reporters', w: 3, defaultW: 4, h: 6 }
      },
      removeAvailableWidget: jest.fn()
    }
    methods.addWidget.call(ctx, { key: 'Reporters' })
    expect(ctx.layout[0].w).toBe(3)
    expect(ctx.allWidgets.Reporters.w).toBe(4)
    expect(ctx.newItemY).toBe(6)

    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, configurable: true })
  })
})
