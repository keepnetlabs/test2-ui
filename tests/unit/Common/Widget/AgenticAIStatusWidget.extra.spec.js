import AgenticAIStatusWidget from '@/components/Common/Widget/WidgetComponents/AgenticAIStatusWidget.vue'

describe('AgenticAIStatusWidget.vue (extra branch coverage)', () => {
  describe('computed', () => {
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
  })

  describe('methods', () => {
    it('selectSubtitle updates card subtitle', () => {
      const card = { subtitle: 'Last 30 days' }
      AgenticAIStatusWidget.methods.selectSubtitle.call({}, card, 'Last 7 days')
      expect(card.subtitle).toBe('Last 7 days')
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
  })
})
