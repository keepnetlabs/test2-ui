import AgenticAIStatusWidget from '@/components/Common/Widget/WidgetComponents/AgenticAIStatusWidget.vue'

describe('AgenticAIStatusWidget.vue (extra branch coverage)', () => {
  describe('computed', () => {
    it('isAutonomousComputed returns true only for Autonomous mode', () => {
      expect(
        AgenticAIStatusWidget.computed.isAutonomousComputed.call({
          executionModeStore: 'Autonomous'
        })
      ).toBe(true)
      expect(
        AgenticAIStatusWidget.computed.isAutonomousComputed.call({
          executionModeStore: 'Manual'
        })
      ).toBe(false)
    })

    it('currentStatusText returns disabled when not active', () => {
      const ctx = {
        isAgenticAllyActiveComputed: false,
        isAutonomousComputed: false,
        isApprovalGatedNoPendingState: false,
        hasPendingApprovals: false
      }
      expect(AgenticAIStatusWidget.computed.currentStatusText.call(ctx)).toBe(
        'Agentic AI is disabled'
      )
    })

    it('currentStatusText returns no pending when approval-gated', () => {
      const ctx = {
        isAgenticAllyActiveComputed: true,
        isAutonomousComputed: false,
        isApprovalGatedNoPendingState: true,
        hasPendingApprovals: false
      }
      expect(AgenticAIStatusWidget.computed.currentStatusText.call(ctx)).toBe(
        'There are no pending AI actions for approval'
      )
    })

    it('currentStatusText returns waiting when has pending approvals', () => {
      const ctx = {
        isAgenticAllyActiveComputed: true,
        isAutonomousComputed: false,
        isApprovalGatedNoPendingState: false,
        hasPendingApprovals: true
      }
      expect(AgenticAIStatusWidget.computed.currentStatusText.call(ctx)).toBe(
        'AI actions are waiting for your approval'
      )
    })

    it('currentStatusText returns autonomous when autonomous', () => {
      const ctx = {
        isAgenticAllyActiveComputed: true,
        isAutonomousComputed: true,
        isApprovalGatedNoPendingState: false,
        hasPendingApprovals: false
      }
      expect(AgenticAIStatusWidget.computed.currentStatusText.call(ctx)).toBe(
        'Agentic AI is running autonomously'
      )
    })

    it('currentStatusText returns approval-gated when enabled but not autonomous', () => {
      const ctx = {
        isAgenticAllyActiveComputed: true,
        isAutonomousComputed: false,
        isApprovalGatedNoPendingState: false,
        hasPendingApprovals: false
      }
      expect(AgenticAIStatusWidget.computed.currentStatusText.call(ctx)).toBe(
        'Agentic AI is enabled - approval-gated'
      )
    })

    it('actionButtonLabelComputed returns approval label when in review state', () => {
      const ctx = {
        isApprovalReviewState: true,
        approvalActionButtonLabel: 'REVIEW',
        actionButtonLabel: 'VIEW'
      }
      expect(AgenticAIStatusWidget.computed.actionButtonLabelComputed.call(ctx)).toBe('REVIEW')
    })

    it('actionButtonOutlinedComputed returns approval outlined when in review state', () => {
      const ctx = {
        isApprovalReviewState: true,
        approvalActionButtonOutlined: false,
        actionButtonOutlined: true
      }
      expect(AgenticAIStatusWidget.computed.actionButtonOutlinedComputed.call(ctx)).toBe(false)
    })

    it('visibleStatCards filters to Actions Executed when autonomous', () => {
      const ctx = {
        isAutonomousComputed: true,
        statCards: [
          { title: 'Actions Executed', subtitle: '', value: 0 },
          { title: 'Pending Approvals', subtitle: '', value: 0 }
        ]
      }
      const result = AgenticAIStatusWidget.computed.visibleStatCards.call(ctx)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Actions Executed')
    })

    it('visibleStatCards returns all stat cards when not autonomous', () => {
      const ctx = {
        isAutonomousComputed: false,
        statCards: [
          { title: 'Actions Executed', subtitle: '', value: 0 },
          { title: 'Pending Approvals', subtitle: '', value: 0 }
        ]
      }
      expect(AgenticAIStatusWidget.computed.visibleStatCards.call(ctx)).toEqual(
        ctx.statCards
      )
    })

    it('currentDescription returns disabled text when not active', () => {
      const ctx = { isAgenticAllyActiveComputed: false, isAutonomousComputed: false, isApprovalGatedNoPendingState: false }
      expect(AgenticAIStatusWidget.computed.currentDescription.call(ctx)).toContain('enable it')
    })

    it('currentDescription returns no pending text when approval-gated with no pending', () => {
      const ctx = { isAgenticAllyActiveComputed: true, isAutonomousComputed: false, isApprovalGatedNoPendingState: true }
      expect(AgenticAIStatusWidget.computed.currentDescription.call(ctx)).toContain('suggests actions')
    })

    it('currentDescription returns autonomous text when autonomous', () => {
      const ctx = { isAgenticAllyActiveComputed: true, isAutonomousComputed: true, isApprovalGatedNoPendingState: false }
      expect(AgenticAIStatusWidget.computed.currentDescription.call(ctx)).toContain('automatically')
    })

    it('currentDescription returns manual review text when manual', () => {
      const ctx = { isAgenticAllyActiveComputed: true, isAutonomousComputed: false, isApprovalGatedNoPendingState: false }
      expect(AgenticAIStatusWidget.computed.currentDescription.call(ctx)).toContain('Review and approve')
    })

    it('showSettingsIcon stays visible regardless of execution mode', () => {
      expect(AgenticAIStatusWidget.computed.showSettingsIcon.call({})).toBe(true)
    })

    it('pendingApprovalsCard returns the matching card when present', () => {
      const pendingCard = { title: 'Pending Approvals', value: 4 }
      const ctx = {
        statCards: [{ title: 'Actions Executed', value: 1 }, pendingCard]
      }
      expect(AgenticAIStatusWidget.computed.pendingApprovalsCard.call(ctx)).toBe(
        pendingCard
      )
    })

    it('pendingApprovalsCard returns undefined when the card is missing', () => {
      const ctx = {
        statCards: [{ title: 'Actions Executed', value: 1 }]
      }
      expect(
        AgenticAIStatusWidget.computed.pendingApprovalsCard.call(ctx)
      ).toBeUndefined()
    })

    it('statusIcon returns check-circle when active', () => {
      const ctx = { isAgenticAllyActiveComputed: true }
      expect(AgenticAIStatusWidget.computed.statusIcon.call(ctx)).toBe('mdi-check-circle-outline')
    })

    it('statusIcon returns creation icon when disabled', () => {
      const ctx = { isAgenticAllyActiveComputed: false }
      expect(AgenticAIStatusWidget.computed.statusIcon.call(ctx)).toBe('mdi-creation')
    })

    it('iconBackgroundColor returns blue-tinted background when active', () => {
      const ctx = { isAgenticAllyActiveComputed: true }
      expect(AgenticAIStatusWidget.computed.iconBackgroundColor.call(ctx)).toBe('#F1F8FE')
    })

    it('iconBackgroundColor returns gray background when disabled', () => {
      const ctx = { isAgenticAllyActiveComputed: false }
      expect(AgenticAIStatusWidget.computed.iconBackgroundColor.call(ctx)).toBe('#e5e7eb')
    })

    it('isApprovalReviewState returns true when active, manual and has pending', () => {
      const ctx = { isAgenticAllyActiveComputed: true, isAutonomousComputed: false, hasPendingApprovals: true }
      expect(AgenticAIStatusWidget.computed.isApprovalReviewState.call(ctx)).toBe(true)
    })

    it('isApprovalReviewState returns false when autonomous', () => {
      const ctx = { isAgenticAllyActiveComputed: true, isAutonomousComputed: true, hasPendingApprovals: true }
      expect(AgenticAIStatusWidget.computed.isApprovalReviewState.call(ctx)).toBe(false)
    })

    it('isApprovalGatedNoPendingState returns true when active, manual and no pending', () => {
      const ctx = { isAgenticAllyActiveComputed: true, isAutonomousComputed: false, hasPendingApprovals: false }
      expect(AgenticAIStatusWidget.computed.isApprovalGatedNoPendingState.call(ctx)).toBe(true)
    })

    it('isApprovalGatedNoPendingState returns false when has pending approvals', () => {
      const ctx = { isAgenticAllyActiveComputed: true, isAutonomousComputed: false, hasPendingApprovals: true }
      expect(AgenticAIStatusWidget.computed.isApprovalGatedNoPendingState.call(ctx)).toBe(false)
    })

    it('isApprovalGatedNoPendingState returns false when Agentic AI is disabled', () => {
      const ctx = { isAgenticAllyActiveComputed: false, isAutonomousComputed: false, hasPendingApprovals: false }
      expect(AgenticAIStatusWidget.computed.isApprovalGatedNoPendingState.call(ctx)).toBe(false)
    })

    it('hasPendingApprovals returns true when card value > 0', () => {
      const ctx = { pendingApprovalsCard: { title: 'Pending Approvals', value: 3 } }
      expect(AgenticAIStatusWidget.computed.hasPendingApprovals.call(ctx)).toBe(true)
    })

    it('hasPendingApprovals returns false when card value is 0', () => {
      const ctx = { pendingApprovalsCard: { title: 'Pending Approvals', value: 0 } }
      expect(AgenticAIStatusWidget.computed.hasPendingApprovals.call(ctx)).toBe(false)
    })

    it('hasPendingApprovals returns falsy when card is undefined', () => {
      const ctx = { pendingApprovalsCard: undefined }
      expect(AgenticAIStatusWidget.computed.hasPendingApprovals.call(ctx)).toBeFalsy()
    })

    it('highlightedCardTitles returns empty array when nothing is highlighted', () => {
      const ctx = {
        isAutonomousComputed: false,
        hasPendingApprovals: false
      }
      expect(AgenticAIStatusWidget.computed.highlightedCardTitles.call(ctx)).toEqual([])
    })

    it('highlightedCardTitles returns only Pending Approvals in manual mode with pending', () => {
      const ctx = {
        isAutonomousComputed: false,
        hasPendingApprovals: true
      }
      expect(AgenticAIStatusWidget.computed.highlightedCardTitles.call(ctx)).toEqual([
        'Pending Approvals'
      ])
    })
  })

  describe('watch', () => {
    it('isAgenticAIEnabledStore watcher fetches stats when enabled and licensed', () => {
      const fetchStats = jest.fn()
      AgenticAIStatusWidget.watch.isAgenticAIEnabledStore.call(
        { hasAgenticAILicense: true, fetchStats },
        true
      )
      expect(fetchStats).toHaveBeenCalledTimes(1)
    })

    it('isAgenticAIEnabledStore watcher does not fetch stats when disabled', () => {
      const fetchStats = jest.fn()
      AgenticAIStatusWidget.watch.isAgenticAIEnabledStore.call(
        { hasAgenticAILicense: true, fetchStats },
        false
      )
      expect(fetchStats).not.toHaveBeenCalled()
    })

    it('isAgenticAIEnabledStore watcher does not fetch stats without license', () => {
      const fetchStats = jest.fn()
      AgenticAIStatusWidget.watch.isAgenticAIEnabledStore.call(
        { hasAgenticAILicense: false, fetchStats },
        true
      )
      expect(fetchStats).not.toHaveBeenCalled()
    })
  })

  describe('methods', () => {
    it('selectSubtitle updates card subtitle', () => {
      const card = { subtitle: 'Last 30 days' }
      AgenticAIStatusWidget.methods.selectSubtitle.call({}, card, 'Last 7 days')
      expect(card.subtitle).toBe('Last 7 days')
    })

    it('selectSubtitle calls updateStatCards when card is Actions Executed', () => {
      const updateStatCards = jest.fn()
      const card = { title: 'Actions Executed', subtitle: 'Last 30 days' }
      AgenticAIStatusWidget.methods.selectSubtitle.call({ updateStatCards }, card, 'Last 7 days')
      expect(card.subtitle).toBe('Last 7 days')
      expect(updateStatCards).toHaveBeenCalled()
    })

    it('selectSubtitle does not call updateStatCards for other cards', () => {
      const updateStatCards = jest.fn()
      const card = { title: 'Pending Approvals', subtitle: '' }
      AgenticAIStatusWidget.methods.selectSubtitle.call({ updateStatCards }, card, 'something')
      expect(updateStatCards).not.toHaveBeenCalled()
    })

    it('navigateToAgenticAISettings pushes route when $router exists', () => {
      const push = jest.fn()
      const ctx = { $router: { push } }
      AgenticAIStatusWidget.methods.navigateToAgenticAISettings.call(ctx)
      expect(push).toHaveBeenCalledWith({
        name: 'Company Settings',
        query: { tab: 'agentic-ai-settings' }
      })
    })

    it('navigateToAgenticAISettings does nothing when $router is undefined', () => {
      expect(() => {
        AgenticAIStatusWidget.methods.navigateToAgenticAISettings.call({})
      }).not.toThrow()
    })

    it('getPeriodKey maps subtitle to API key correctly', () => {
      const ctx = {}
      expect(AgenticAIStatusWidget.methods.getPeriodKey.call(ctx, 'Last 30 days')).toBe('last30Days')
      expect(AgenticAIStatusWidget.methods.getPeriodKey.call(ctx, 'Last 7 days')).toBe('last7Days')
      expect(AgenticAIStatusWidget.methods.getPeriodKey.call(ctx, 'Last 24 hours')).toBe('last24Hours')
    })

    it('getPeriodKey returns last30Days as default for unknown subtitle', () => {
      const ctx = {}
      expect(AgenticAIStatusWidget.methods.getPeriodKey.call(ctx, 'unknown')).toBe('last30Days')
      expect(AgenticAIStatusWidget.methods.getPeriodKey.call(ctx, '')).toBe('last30Days')
    })

    it('isPendingApprovalsCard returns true for Pending Approvals card', () => {
      const ctx = {}
      expect(AgenticAIStatusWidget.methods.isPendingApprovalsCard.call(ctx, { title: 'Pending Approvals' })).toBe(true)
    })

    it('isPendingApprovalsCard returns false for other cards', () => {
      const ctx = {}
      expect(AgenticAIStatusWidget.methods.isPendingApprovalsCard.call(ctx, { title: 'Actions Executed' })).toBe(false)
    })

    it('updateStatCards uses autonomous.Approved in autonomous mode', () => {
      const statCards = [
        { title: 'Actions Executed', subtitle: 'Last 30 days', value: 0 },
        { title: 'Pending Approvals', subtitle: '', value: 0 }
      ]
      const ctx = {
        isAutonomousComputed: true,
        statsData: {
          last30Days: {
            autonomous: { Approved: 2, Pending: 0 },
            approvalGated: { Approved: 423, Pending: 96 },
            total: { Approved: 425, Pending: 96 }
          }
        },
        statCards,
        getPeriodKey: AgenticAIStatusWidget.methods.getPeriodKey
      }
      AgenticAIStatusWidget.methods.updateStatCards.call(ctx)
      expect(statCards[0].value).toBe(2)
      expect(statCards[1].value).toBe(96)
    })

    it('updateStatCards uses approvalGated.Approved in manual mode', () => {
      const statCards = [
        { title: 'Actions Executed', subtitle: 'Last 30 days', value: 0 },
        { title: 'Pending Approvals', subtitle: '', value: 0 }
      ]
      const ctx = {
        isAutonomousComputed: false,
        statsData: {
          last30Days: {
            autonomous: { Approved: 2, Pending: 0 },
            approvalGated: { Approved: 423, Pending: 96 },
            total: { Approved: 425, Pending: 96 }
          }
        },
        statCards,
        getPeriodKey: AgenticAIStatusWidget.methods.getPeriodKey
      }
      AgenticAIStatusWidget.methods.updateStatCards.call(ctx)
      expect(statCards[0].value).toBe(423)
      expect(statCards[1].value).toBe(96)
    })

    it('updateStatCards does nothing when statsData is null', () => {
      const statCards = [
        { title: 'Actions Executed', subtitle: 'Last 30 days', value: 7 }
      ]
      const ctx = { statsData: null, statCards }
      AgenticAIStatusWidget.methods.updateStatCards.call(ctx)
      expect(statCards[0].value).toBe(7)
    })

    it('updateStatCards falls back to 0 when the selected stats period is missing', () => {
      const statCards = [
        { title: 'Actions Executed', subtitle: 'Last 7 days', value: 11 },
        { title: 'Pending Approvals', subtitle: '', value: 5 }
      ]
      const ctx = {
        isAutonomousComputed: true,
        statsData: {
          last30Days: {
            approvalGated: { Pending: 0 }
          }
        },
        statCards,
        getPeriodKey: AgenticAIStatusWidget.methods.getPeriodKey
      }
      AgenticAIStatusWidget.methods.updateStatCards.call(ctx)
      expect(statCards[0].value).toBe(0)
      expect(statCards[1].value).toBe(0)
    })

    it('updateStatCards skips missing cards without throwing', () => {
      const ctx = {
        isAutonomousComputed: false,
        statsData: {
          last30Days: {
            approvalGated: { Approved: 4, Pending: 2 }
          }
        },
        statCards: [{ title: 'Other Card', subtitle: '', value: 1 }],
        getPeriodKey: AgenticAIStatusWidget.methods.getPeriodKey
      }
      expect(() => {
        AgenticAIStatusWidget.methods.updateStatCards.call(ctx)
      }).not.toThrow()
    })

    it('handleChatWithAgenticAI dispatches open-agentic-ai-chat event', () => {
      const events = []
      globalThis.dispatchEvent = (e) => events.push(e)
      AgenticAIStatusWidget.methods.handleChatWithAgenticAI.call({})
      expect(events[0].type).toBe('open-agentic-ai-chat')
    })
  })
})
