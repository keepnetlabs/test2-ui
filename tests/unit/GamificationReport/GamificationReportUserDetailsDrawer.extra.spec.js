import GamificationReportUserDetailsDrawer from '@/components/GamificationReport/GamificationReportUserDetailsDrawer.vue'

describe('GamificationReportUserDetailsDrawer.vue (extra branches)', () => {
  const { methods } = GamificationReportUserDetailsDrawer

  it('getProductType covers callback/vishing/quishing branches', () => {
    expect(methods.getProductType({ productType: 'PHISHING SIMULATOR - TEST' })).toBe(
      'phishing campaign'
    )
    expect(methods.getProductType({ productType: 'SMISHING SIMULATOR - TEST' })).toBe(
      'smishing campaign'
    )
    expect(methods.getProductType({ productType: 'CALLBACK SIMULATOR - TEST' })).toBe(
      'callback campaign'
    )
    expect(methods.getProductType({ productType: 'VISHING SIMULATOR - TEST' })).toBe(
      'vishing campaign'
    )
    expect(methods.getProductType({ productType: 'QUISHING SIMULATOR - TEST' })).toBe(
      'quishing campaign'
    )
    expect(methods.getProductType({ productType: 'UNKNOWN PRODUCT - TEST' })).toBe('')
  })

  it('getProductType returns empty for lowercase/non-matching product labels', () => {
    expect(methods.getProductType({ productType: 'phishing simulator - test' })).toBe('')
  })

  it('getProductIconPath covers major product/action branch combinations', () => {
    const phishingOpened = methods.getProductIconPath({
      productType: 'PHISHING SIMULATOR - TEST',
      ActionType: 'Opened Email'
    })
    const phishingFail = methods.getProductIconPath({
      productType: 'PHISHING SIMULATOR - TEST',
      ActionType: 'Clicked Link'
    })
    const phishingSuccess = methods.getProductIconPath({
      productType: 'PHISHING SIMULATOR - TEST',
      ActionType: 'Reported'
    })
    const phishingNeutral = methods.getProductIconPath({
      productType: 'PHISHING SIMULATOR - TEST',
      ActionType: 'Email Sent'
    })

    const callbackFail = methods.getProductIconPath({
      productType: 'CALLBACK SIMULATOR - TEST',
      ActionType: 'Called Back'
    })
    const callbackNeutral = methods.getProductIconPath({
      productType: 'CALLBACK SIMULATOR - TEST',
      ActionType: 'Call Sent'
    })

    const vishingNeutral = methods.getProductIconPath({
      productType: 'VISHING SIMULATOR - TEST',
      ActionType: 'Call Sent'
    })
    const smishingNeutral = methods.getProductIconPath({
      productType: 'SMISHING SIMULATOR - TEST',
      ActionType: 'SMS Sent'
    })
    const quishingSuccess = methods.getProductIconPath({
      productType: 'QUISHING SIMULATOR - TEST',
      ActionType: 'Reported'
    })
    const quishingFail = methods.getProductIconPath({
      productType: 'QUISHING SIMULATOR - TEST',
      ActionType: 'Clicked Link'
    })
    const quishingNeutral = methods.getProductIconPath({
      productType: 'QUISHING SIMULATOR - TEST',
      ActionType: 'QR Sent'
    })
    const vishingFail = methods.getProductIconPath({
      productType: 'VISHING SIMULATOR - TEST',
      ActionType: 'Called Back'
    })
    const vishingSuccess = methods.getProductIconPath({
      productType: 'VISHING SIMULATOR - TEST',
      ActionType: 'Answered'
    })
    const callbackSuccess = methods.getProductIconPath({
      productType: 'CALLBACK SIMULATOR - TEST',
      ActionType: 'Reported'
    })
    const smishingFail = methods.getProductIconPath({
      productType: 'SMISHING SIMULATOR - TEST',
      ActionType: 'Clicked Link'
    })
    const awarenessFail = methods.getProductIconPath({
      productType: 'SECURITY AWARENESS - TEST',
      ActionType: 'Clicked Link'
    })
    const awarenessNeutral = methods.getProductIconPath({
      productType: 'SECURITY AWARENESS - TEST',
      ActionType: 'Email Sent'
    })
    const awarenessSuccess = methods.getProductIconPath({
      productType: 'SECURITY AWARENESS - TEST',
      ActionType: 'Reported'
    })
    const awarenessOpened = methods.getProductIconPath({
      productType: 'SECURITY AWARENESS - TEST',
      ActionType: 'Opened Email'
    })
    const awarenessEmailOpenedAlias = methods.getProductIconPath({
      productType: 'SECURITY AWARENESS - TEST',
      ActionType: 'Email Opened'
    })
    const irIcon = methods.getProductIconPath({
      productType: 'INCIDENT RESPONDER - TEST',
      ActionType: 'Reported Email'
    })
    const fallbackIcon = methods.getProductIconPath({
      productType: 'UNKNOWN PRODUCT - TEST',
      ActionType: 'Unknown'
    })

    expect(phishingOpened).toBeDefined()
    expect(phishingFail).toBeDefined()
    expect(phishingSuccess).toBeDefined()
    expect(phishingNeutral).toBeDefined()
    expect(callbackFail).toBeDefined()
    expect(callbackNeutral).toBeDefined()
    expect(vishingNeutral).toBeDefined()
    expect(vishingFail).toBeDefined()
    expect(vishingSuccess).toBeDefined()
    expect(smishingNeutral).toBeDefined()
    expect(smishingFail).toBeDefined()
    expect(quishingSuccess).toBeDefined()
    expect(quishingFail).toBeDefined()
    expect(quishingNeutral).toBeDefined()
    expect(callbackSuccess).toBeDefined()
    expect(awarenessOpened).toBeDefined()
    expect(awarenessEmailOpenedAlias).toBeDefined()
    expect(awarenessFail).toBeDefined()
    expect(awarenessNeutral).toBeDefined()
    expect(awarenessSuccess).toBeDefined()
    expect(irIcon).toBeDefined()
    expect(fallbackIcon).toBeDefined()
  })

  it('handleDrawerClickOutside ignores user info icon wrapper and menu poppers', () => {
    const emit = jest.fn()
    const ctx = {
      isShowDownloadModal: false,
      menu: false,
      $emit: emit
    }

    methods.handleDrawerClickOutside.call(ctx, {
      target: {
        closest: (selector) =>
          selector === '.gamification-report__user-info-icon-wrapper' ? {} : null
      }
    })
    methods.handleDrawerClickOutside.call(ctx, {
      target: {
        closest: (selector) => (selector === '.v-menu__content' ? {} : null)
      }
    })

    expect(emit).not.toHaveBeenCalled()
  })

  it('handleDrawerClickOutside ignores el-select-dropdown targets', () => {
    const emit = jest.fn()
    methods.handleDrawerClickOutside.call(
      {
        isShowDownloadModal: false,
        menu: false,
        $emit: emit
      },
      {
        target: {
          closest: (selector) => (selector === '.el-select-dropdown' ? {} : null)
        }
      }
    )

    expect(emit).not.toHaveBeenCalled()
  })

  it('handleDrawerClickOutside ignores el-picker-panel targets', () => {
    const emit = jest.fn()
    methods.handleDrawerClickOutside.call(
      {
        isShowDownloadModal: false,
        menu: false,
        $emit: emit
      },
      {
        target: {
          closest: (selector) => (selector === '.el-picker-panel' ? {} : null)
        }
      }
    )

    expect(emit).not.toHaveBeenCalled()
  })

  it('handleDrawerClickOutside ignores el-popper targets', () => {
    const emit = jest.fn()
    methods.handleDrawerClickOutside.call(
      {
        isShowDownloadModal: false,
        menu: false,
        $emit: emit
      },
      {
        target: {
          closest: (selector) => (selector === '.el-popper' ? {} : null)
        }
      }
    )

    expect(emit).not.toHaveBeenCalled()
  })

  it('handleDrawerClickOutside returns early when download modal is open', () => {
    const emit = jest.fn()
    methods.handleDrawerClickOutside.call(
      {
        isShowDownloadModal: true,
        menu: false,
        $emit: emit
      },
      {
        target: { closest: () => null }
      }
    )

    expect(emit).not.toHaveBeenCalled()
  })

  it('handleDrawerClickOutside returns early when filters menu is open', () => {
    const emit = jest.fn()
    methods.handleDrawerClickOutside.call(
      {
        isShowDownloadModal: false,
        menu: true,
        $emit: emit
      },
      {
        target: { closest: () => null }
      }
    )

    expect(emit).not.toHaveBeenCalled()
  })

  it('handleDrawerClickOutside emits close when event target is missing', () => {
    const emit = jest.fn()
    methods.handleDrawerClickOutside.call(
      {
        isShowDownloadModal: false,
        menu: false,
        $emit: emit
      },
      {}
    )

    expect(emit).toHaveBeenCalledWith('on-close')
  })

  it('handleDrawerClickOutside emits close when no guard branch is matched', () => {
    const emit = jest.fn()
    const ctx = {
      isShowDownloadModal: false,
      menu: false,
      $emit: emit
    }

    methods.handleDrawerClickOutside.call(ctx, {
      target: {
        closest: () => null
      }
    })

    expect(emit).toHaveBeenCalledWith('on-close')
  })

  it('formatPoints handles undefined/null and negative points', () => {
    expect(methods.formatPoints()).toBe('')
    expect(methods.formatPoints({ points: null })).toBe('')
    expect(methods.formatPoints({ points: -15 })).toBe('15')
    expect(methods.formatPoints({ points: '-12' })).toBe('12')
    expect(methods.formatPoints({ points: 0 })).toBe('0')
    expect(methods.formatPoints({ points: 7 })).toBe('7')
  })

  it('callForGetTimeZones dispatches only when timezone list is empty', () => {
    const dispatch = jest.fn()
    const ctxShouldDispatch = {
      $store: {
        getters: {
          'common/getTimezones': { timeZoneList: [] }
        },
        dispatch
      }
    }
    methods.callForGetTimeZones.call(ctxShouldDispatch)
    expect(dispatch).toHaveBeenCalledWith('common/getTimezone')

    dispatch.mockClear()
    const ctxShouldNotDispatch = {
      $store: {
        getters: {
          'common/getTimezones': { timeZoneList: ['UTC'] }
        },
        dispatch
      }
    }
    methods.callForGetTimeZones.call(ctxShouldNotDispatch)
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('callForGetTimeZones does not dispatch when timezone getter is missing', () => {
    const dispatch = jest.fn()
    methods.callForGetTimeZones.call({
      $store: {
        getters: {},
        dispatch
      }
    })

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('callForGetTimeZones dispatches when getter exists but timeZoneList is missing', () => {
    const dispatch = jest.fn()
    methods.callForGetTimeZones.call({
      $store: {
        getters: {
          'common/getTimezones': {}
        },
        dispatch
      }
    })

    expect(dispatch).toHaveBeenCalledWith('common/getTimezone')
  })

  it('callForGetTimeZones safely no-ops when store is missing', () => {
    expect(() => methods.callForGetTimeZones.call({})).not.toThrow()
  })

  it('callForGetTimeZones does not dispatch when timezone getter is null', () => {
    const dispatch = jest.fn()
    methods.callForGetTimeZones.call({
      $store: {
        getters: {
          'common/getTimezones': null
        },
        dispatch
      }
    })

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('getLoadMoreButtonStyle toggles background by hover state', () => {
    expect(methods.getLoadMoreButtonStyle(true)).toEqual({
      'background-color': '#F2F2F2',
      marginBottom: '16px'
    })
    expect(methods.getLoadMoreButtonStyle(false)).toEqual({
      'background-color': '#FFFFFF',
      marginBottom: '16px'
    })
  })
})
