import ActionItem from '@/components/Playbook/ActionItem.vue'

describe('ActionItem.vue methods', () => {
  it('validateIntegrations returns Required when no integration selected', () => {
    const ctx = { getSelectedIntegrations: () => 0 }
    const result = ActionItem.methods.validateIntegrations.call(ctx)
    expect(result).toBe('Required')
  })

  it('validateIntegrations returns true when at least one integration selected', () => {
    const ctx = { getSelectedIntegrations: () => 2 }
    const result = ActionItem.methods.validateIntegrations.call(ctx)
    expect(result).toBe(true)
  })

  it('searchEnginesModel filters engines by search text and resets on empty text', () => {
    const ctx = {
      searchEnginesModelInput: 'vir',
      analysisEngines: [
        { name: 'VirusTotal', resourceId: '1' },
        { name: 'SafeBrowse', resourceId: '2' }
      ],
      searchEnginesData: null
    }

    ActionItem.methods.searchEnginesModel.call(ctx)
    expect(ctx.searchEnginesData).toEqual([{ name: 'VirusTotal', resourceId: '1' }])

    ctx.searchEnginesModelInput = ''
    ActionItem.methods.searchEnginesModel.call(ctx)
    expect(ctx.searchEnginesData).toBe(null)
  })

  it('getNotifyTypes disables Reporter option when Reporter is already selected', () => {
    const ctx = {
      targetUserType: ['Reporter'],
      act: { notifyTypes: ['Reporter', 'Users', 'Groups'] }
    }

    const result = ActionItem.methods.getNotifyTypes.call(ctx)
    expect(result).toEqual([
      { text: 'Reporter', value: 'Reporter', disabled: true },
      { text: 'Users', value: 'Users', disabled: false },
      { text: 'Groups', value: 'Groups', disabled: false }
    ])
  })

  it('checkAllDataChecked updates selected state from all toggles', () => {
    const ctx = {
      analysisEngines: [{ isCheckHash: false, isCheckFile: false, isCheckUrl: true, isCheckSenderIP: false }]
    }
    ActionItem.methods.checkAllDataChecked.call(ctx, 0)
    expect(ctx.analysisEngines[0].selected).toBe(true)
  })

  it('hashChange toggles hash flag in both normal and searched collections', () => {
    const ctx = {
      analysisEngines: [{ resourceId: 'e1', isCheckHash: false, isCheckFile: false, isCheckUrl: false, isCheckSenderIP: false, selected: false }],
      searchEnginesData: null,
      checkAllDataChecked: ActionItem.methods.checkAllDataChecked
    }
    ActionItem.methods.hashChange.call(ctx, false, 0)
    expect(ctx.analysisEngines[0].isCheckHash).toBe(true)
    expect(ctx.analysisEngines[0].selected).toBe(true)

    ctx.searchEnginesData = [{ resourceId: 'e1' }]
    ActionItem.methods.hashChange.call(ctx, true, 0)
    expect(ctx.analysisEngines[0].isCheckHash).toBe(false)
  })

  it('acceptAllAnalysisEnginesClick selects all or only filtered ones', () => {
    const base = [
      { resourceId: '1', isCheckUrl: false, isCheckHash: false, isCheckFile: false, isCheckSenderIP: false, selected: false },
      { resourceId: '2', isCheckUrl: false, isCheckHash: false, isCheckFile: false, isCheckSenderIP: false, selected: false }
    ]

    const ctxAll = {
      acceptAllAnalysisEngines: true,
      analysisEngines: JSON.parse(JSON.stringify(base)),
      searchEnginesModelInput: '',
      searchEnginesData: null
    }
    ActionItem.methods.acceptAllAnalysisEnginesClick.call(ctxAll)
    expect(ctxAll.analysisEngines.every((i) => i.selected)).toBe(true)

    const ctxFiltered = {
      acceptAllAnalysisEngines: true,
      analysisEngines: JSON.parse(JSON.stringify(base)),
      searchEnginesModelInput: 'x',
      searchEnginesData: [JSON.parse(JSON.stringify(base[0]))]
    }
    ActionItem.methods.acceptAllAnalysisEnginesClick.call(ctxFiltered)
    expect(ctxFiltered.analysisEngines[0].selected).toBe(true)
    expect(ctxFiltered.analysisEngines[1].selected).toBe(false)
  })

  it('analysisEnginesChange updates capability flags based on engine type', () => {
    const ctx = {
      analysisEngines: [{ isCheckUrl: false, isCheckHash: false, isCheckFile: false, isCheckSenderIP: false }],
      searchEnginesData: null
    }
    const engine = {
      selected: true,
      analysisEngineType: {
        isSendUrl: true,
        isSendFileHash: false,
        isSendFile: true,
        isSendIp: false
      }
    }
    ActionItem.methods.analysisEnginesChange.call(ctx, engine, 0)
    expect(ctx.analysisEngines[0]).toMatchObject({
      isCheckUrl: true,
      isCheckHash: false,
      isCheckFile: true,
      isCheckSenderIP: false
    })
  })

  it('checkIsShowAnalysisResultDisabled resets related arrays when analyze action missing', () => {
    const ctx = {
      actions: [{ val: 'notify' }],
      isShowAnalysisResultDisabled: false,
      analysisResults: ['Phishing'],
      isShowAnalysisResults: [true]
    }
    ActionItem.methods.checkIsShowAnalysisResultDisabled.call(ctx)
    expect(ctx.isShowAnalysisResultDisabled).toBe(true)
    expect(ctx.analysisResults).toEqual([])
    expect(ctx.isShowAnalysisResults).toEqual([])
  })

  it('updateAnalysisEngines merges edited analyzer settings by integration id', () => {
    const ctx = {
      analysisEngines: [{ resourceId: 'a1', selected: false, isCheckUrl: false }],
      editedPlaybookActionAnalyzers: [{ integrationId: 'a1', isCheckUrl: true }]
    }
    ActionItem.methods.updateAnalysisEngines.call(ctx)
    expect(ctx.analysisEngines[0]).toMatchObject({
      resourceId: 'a1',
      selected: true,
      isCheckUrl: true
    })
  })
})
