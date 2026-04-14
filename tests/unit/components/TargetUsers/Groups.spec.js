jest.mock('@/api/targetUsers', () => ({
  searchTargetGroups: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
  ),
  createTargetGroup: jest.fn(() => Promise.resolve()),
  updateTargetGroup: jest.fn(() => Promise.resolve()),
  deleteTargetGroup: jest.fn(() => Promise.resolve()),
  exportTargetGroups: jest.fn(() => Promise.resolve())
}))

jest.mock('@/api/agenticAIService', () => ({
  sendBatchAutonomous: jest.fn(() => Promise.resolve({ data: {} }))
}))

import Groups from '@/components/TargetUsers/Groups.vue'
import { sendBatchAutonomous } from '@/api/agenticAIService'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TargetUsers Groups.vue', () => {
  const { computed } = Groups

  it('getGroupNameTooltipMessage returns empty when no row name', () => {
    const ctx = {}
    expect(Groups.methods.getGroupNameTooltipMessage.call(ctx, {})).toBe('')
  })

  it('getGroupNameTooltipMessage returns Repeat Offenders message', () => {
    const ctx = {}
    const msg = Groups.methods.getGroupNameTooltipMessage.call(ctx, { name: 'Repeat Offenders' })
    expect(msg).toContain('Repeat Offenders')
    expect(msg).toContain('phishing campaigns')
  })

  it('getGroupNameTooltipMessage returns New Hires message', () => {
    const ctx = {}
    const msg = Groups.methods.getGroupNameTooltipMessage.call(ctx, { name: 'New Hires' })
    expect(msg).toContain('New hires')
    expect(msg).toContain('90 days')
  })

  it('getGroupNameTooltipMessage returns Non-Simulated Users message', () => {
    const ctx = {}
    const msg = Groups.methods.getGroupNameTooltipMessage.call(ctx, { name: 'Non-Simulated Users' })
    expect(msg).toContain('simulations')
  })

  it('getGroupNameTooltipMessage returns Untrained Users message', () => {
    const ctx = {}
    const msg = Groups.methods.getGroupNameTooltipMessage.call(ctx, { name: 'Untrained Users' })
    expect(msg).toContain('training')
  })

  it('getGroupNameTooltipMessage returns empty for unknown group', () => {
    const ctx = {}
    expect(Groups.methods.getGroupNameTooltipMessage.call(ctx, { name: 'Custom Group' })).toBe('')
  })

  it('getAddUsersToGroupButtonTooltipMessage returns SCIM message when isCheckSCIM', () => {
    const ctx = {}
    expect(
      Groups.methods.getAddUsersToGroupButtonTooltipMessage.call(ctx, { name: 'G1', isScimGroup: true }, true)
    ).toContain('SCIM')
  })

  it('getAddUsersToGroupButtonTooltipMessage returns Google message for Google group', () => {
    const ctx = {}
    expect(
      Groups.methods.getAddUsersToGroupButtonTooltipMessage.call(ctx, { name: 'G1', isGoogleGroup: true })
    ).toContain('Google')
  })

  it('getDeleteButtonTooltipMessage returns message for Repeat Offenders', () => {
    const ctx = {}
    expect(
      Groups.methods.getDeleteButtonTooltipMessage.call(ctx, { name: 'Repeat Offenders' })
    ).toContain('deleted')
  })

  it('isTooltipRenderable returns true for SCIM group when isCheckSCIM', () => {
    const ctx = {}
    expect(Groups.methods.isTooltipRenderable.call(ctx, { isScimGroup: true }, true)).toBe(true)
  })

  it('isTooltipRenderable returns true for system groups', () => {
    const ctx = {}
    expect(Groups.methods.isTooltipRenderable.call(ctx, { name: 'Repeat Offenders' })).toBe(true)
  })

  it('isTooltipRenderable returns false for custom group', () => {
    const ctx = {}
    expect(Groups.methods.isTooltipRenderable.call(ctx, { name: 'Custom Group' })).toBe(false)
  })

  it('handleDelete sets selectedRow and calls changeDeleteGroupModalStatus', () => {
    const ctx = {
      changeDeleteGroupModalStatus: jest.fn(),
      selectedRow: null
    }
    const row = { resourceId: 'g1' }
    Groups.methods.handleDelete.call(ctx, row)
    expect(ctx.changeDeleteGroupModalStatus).toHaveBeenCalledWith(true)
    expect(ctx.selectedRow).toBe(row)
  })

  it('handleDeleteGroupMultiple calls handleDeleteGroup for each item', () => {
    const handleDeleteGroup = jest.fn()
    const ctx = { handleDeleteGroup }
    const selection = [{ resourceId: 'g1' }, { resourceId: 'g2' }]
    Groups.methods.handleDeleteGroupMultiple.call(ctx, selection)
    expect(handleDeleteGroup).toHaveBeenCalledTimes(2)
  })

  it('showSendWithAIAction requires license and company Agentic AI enabled', () => {
    expect(
      computed.showSendWithAIAction.call({
        hasAgenticAILicense: true,
        isAgenticAIEnabledStore: true
      })
    ).toBe(true)
    expect(
      computed.showSendWithAIAction.call({
        hasAgenticAILicense: false,
        isAgenticAIEnabledStore: true
      })
    ).toBe(false)
    expect(
      computed.showSendWithAIAction.call({
        hasAgenticAILicense: true,
        isAgenticAIEnabledStore: false
      })
    ).toBe(false)
  })

  it('agenticAIDialogMode returns approval for approval-gated execution', () => {
    expect(
      computed.agenticAIDialogMode.call({
        executionModeStore: 'ApprovalGated'
      })
    ).toBe('approval')
  })

  it('isSendWithAIActionDisabled returns true when add users and delete are both disabled', () => {
    const ctx = {
      isTooltipRenderable: Groups.methods.isTooltipRenderable,
      isTargetGroupEmpty: Groups.methods.isTargetGroupEmpty,
      getTargetGroupUserCount: Groups.methods.getTargetGroupUserCount
    }

    expect(Groups.methods.isSendWithAIActionDisabled.call(ctx, { name: 'Repeat Offenders' })).toBe(true)
  })

  it('isSendWithAIActionDisabled returns false when only add users is disabled', () => {
    const ctx = {
      isTooltipRenderable: Groups.methods.isTooltipRenderable,
      isTargetGroupEmpty: Groups.methods.isTargetGroupEmpty,
      getTargetGroupUserCount: Groups.methods.getTargetGroupUserCount
    }

    expect(
      Groups.methods.isSendWithAIActionDisabled.call(ctx, { name: 'Custom Group', isScimGroup: true })
    ).toBe(false)
  })

  it('getTargetGroupUserCount reads usersCount values', () => {
    expect(Groups.methods.getTargetGroupUserCount.call({}, { usersCount: 7 })).toBe(7)
  })

  it('getTargetGroupUserCount reads count values', () => {
    expect(Groups.methods.getTargetGroupUserCount.call({}, { count: 3 })).toBe(3)
  })

  it('getTargetGroupUserCount falls back to extraDatas.userCount', () => {
    expect(Groups.methods.getTargetGroupUserCount.call({}, { extraDatas: { userCount: 4 } })).toBe(4)
  })

  it('getTargetGroupUserCount returns null when no numeric count exists', () => {
    expect(Groups.methods.getTargetGroupUserCount.call({}, { name: 'Custom Group' })).toBe(null)
    expect(Groups.methods.getTargetGroupUserCount.call({}, { userCount: 'N/A' })).toBe(null)
  })

  it('isSendWithAIActionDisabled returns true for groups with 0 users', () => {
    const ctx = {
      isTooltipRenderable: Groups.methods.isTooltipRenderable,
      isTargetGroupEmpty: Groups.methods.isTargetGroupEmpty,
      getTargetGroupUserCount: Groups.methods.getTargetGroupUserCount
    }

    expect(Groups.methods.isSendWithAIActionDisabled.call(ctx, { name: 'Empty Group', userCount: 0 })).toBe(
      true
    )
  })

  it('getSendWithAIButtonTooltipMessage returns AI-disabled tooltip only when AI action is disabled', () => {
    const ctx = {
      isSendWithAIActionDisabled: Groups.methods.isSendWithAIActionDisabled,
      isTooltipRenderable: Groups.methods.isTooltipRenderable,
      isTargetGroupEmpty: Groups.methods.isTargetGroupEmpty,
      getTargetGroupUserCount: Groups.methods.getTargetGroupUserCount
    }

    expect(Groups.methods.getSendWithAIButtonTooltipMessage.call(ctx, { name: 'Untrained Users' })).toBe(
      'Agentic AI actions cannot be run for this group.'
    )
    expect(
      Groups.methods.getSendWithAIButtonTooltipMessage.call(ctx, { name: 'Custom Group' })
    ).toBe('')
  })

  it('getSendWithAIButtonTooltipMessage returns empty-group tooltip for groups with 0 users', () => {
    const ctx = {
      isSendWithAIActionDisabled: Groups.methods.isSendWithAIActionDisabled,
      isTooltipRenderable: Groups.methods.isTooltipRenderable,
      isTargetGroupEmpty: Groups.methods.isTargetGroupEmpty,
      getTargetGroupUserCount: Groups.methods.getTargetGroupUserCount
    }

    expect(
      Groups.methods.getSendWithAIButtonTooltipMessage.call(ctx, { name: 'Empty Group', userCount: 0 })
    ).toBe('Agentic AI actions cannot be run for groups with 0 user.')
  })

  it('handleSendWithAI does not open dialog when AI action is disabled', () => {
    const ctx = {
      selectedRowForAI: null,
      isSendWithAIDialogOpen: false,
      sendWithAIOptions: { training: false, phishing: false },
      isSendWithAIActionDisabled: jest.fn(() => true)
    }

    Groups.methods.handleSendWithAI.call(ctx, { name: 'Empty Group', userCount: 0 })

    expect(ctx.isSendWithAIActionDisabled).toHaveBeenCalled()
    expect(ctx.selectedRowForAI).toBe(null)
    expect(ctx.isSendWithAIDialogOpen).toBe(false)
    expect(ctx.sendWithAIOptions).toEqual({ training: false, phishing: false })
  })

  it('handleConfirmSendWithAI closes dialog and dispatches success snackbar on success', async () => {
    const dispatch = jest.fn()
    const ctx = {
      selectedRowForAI: { resourceId: 'g-1' },
      agenticAIDialogMode: 'approval',
      handleCloseSendWithAIDialog: jest.fn(),
      getSendWithAISuccessMessage: Groups.methods.getSendWithAISuccessMessage,
      $store: { dispatch },
      isTargetGroupEmpty: Groups.methods.isTargetGroupEmpty,
      getTargetGroupUserCount: Groups.methods.getTargetGroupUserCount
    }

    await Groups.methods.handleConfirmSendWithAI.call(ctx, {
      training: true,
      phishing: true,
      sendAfterPhishingSimulation: true
    })
    await flushPromises()

    expect(sendBatchAutonomous).toHaveBeenCalledWith({
      targetGroupResourceId: 'g-1',
      actions: ['training', 'phishing'],
      sendAfterPhishingSimulation: true
    })
    expect(ctx.handleCloseSendWithAIDialog).toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        message:
          'Agentic AI actions were sent for approval. No emails will be sent to users in the selected group until the request is approved.'
      })
    )
  })

  it('handleConfirmSendWithAI keeps dialog open and dispatches error snackbar on failure', async () => {
    sendBatchAutonomous.mockRejectedValueOnce(new Error('fail'))
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const dispatch = jest.fn()
    const ctx = {
      selectedRowForAI: { resourceId: 'g-2' },
      agenticAIDialogMode: 'autonomous',
      handleCloseSendWithAIDialog: jest.fn(),
      getSendWithAIErrorMessage: Groups.methods.getSendWithAIErrorMessage,
      $store: { dispatch },
      isTargetGroupEmpty: Groups.methods.isTargetGroupEmpty,
      getTargetGroupUserCount: Groups.methods.getTargetGroupUserCount
    }

    await Groups.methods.handleConfirmSendWithAI.call(ctx, {
      training: false,
      phishing: true
    })
    await flushPromises()

    expect(ctx.handleCloseSendWithAIDialog).not.toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        message: 'Failed to start the Agentic AI process. Please try again.'
      })
    )

    consoleSpy.mockRestore()
  })

  it('handleConfirmSendWithAI clears isSendWithAISubmitting after success', async () => {
    const ctx = {
      selectedRowForAI: { resourceId: 'g-1' },
      agenticAIDialogMode: 'approval',
      handleCloseSendWithAIDialog: jest.fn(),
      getSendWithAISuccessMessage: Groups.methods.getSendWithAISuccessMessage,
      $store: { dispatch: jest.fn() },
      isSendWithAISubmitting: false,
      isTargetGroupEmpty: Groups.methods.isTargetGroupEmpty,
      getTargetGroupUserCount: Groups.methods.getTargetGroupUserCount
    }

    await Groups.methods.handleConfirmSendWithAI.call(ctx, {
      training: true,
      phishing: false
    })
    await flushPromises()

    expect(ctx.isSendWithAISubmitting).toBe(false)
  })

  it('handleConfirmSendWithAI clears isSendWithAISubmitting after API error', async () => {
    sendBatchAutonomous.mockRejectedValueOnce(new Error('fail'))
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const ctx = {
      selectedRowForAI: { resourceId: 'g-err' },
      agenticAIDialogMode: 'autonomous',
      handleCloseSendWithAIDialog: jest.fn(),
      getSendWithAIErrorMessage: Groups.methods.getSendWithAIErrorMessage,
      $store: { dispatch: jest.fn() },
      isSendWithAISubmitting: false,
      isTargetGroupEmpty: Groups.methods.isTargetGroupEmpty,
      getTargetGroupUserCount: Groups.methods.getTargetGroupUserCount
    }

    await Groups.methods.handleConfirmSendWithAI.call(ctx, {
      training: true,
      phishing: false
    })
    await flushPromises()

    expect(ctx.isSendWithAISubmitting).toBe(false)
    consoleSpy.mockRestore()
  })

  it('handleConfirmSendWithAI does not call API and shows error snackbar for groups with 0 users', async () => {
    const dispatch = jest.fn()
    const previousCallCount = sendBatchAutonomous.mock.calls.length
    const ctx = {
      selectedRowForAI: { resourceId: 'g-empty', userCount: 0 },
      $store: { dispatch },
      isSendWithAISubmitting: false,
      isTargetGroupEmpty: Groups.methods.isTargetGroupEmpty,
      getTargetGroupUserCount: Groups.methods.getTargetGroupUserCount
    }

    await Groups.methods.handleConfirmSendWithAI.call(ctx, {
      training: true,
      phishing: false
    })

    expect(sendBatchAutonomous.mock.calls.length).toBe(previousCallCount)
    expect(dispatch).toHaveBeenCalledWith('common/createSnackBar', {
      message: 'Agentic AI actions cannot be run because the selected group has 0 user.',
      icon: 'mdi-alert-circle',
      color: '#f56c6c'
    })
    expect(ctx.isSendWithAISubmitting).toBe(false)
  })

  it('handleCloseSendWithAIDialog resets isSendWithAISubmitting', () => {
    const ctx = {
      isSendWithAIDialogOpen: true,
      isSendWithAISubmitting: true,
      selectedRowForAI: { resourceId: 'g-x' },
      sendWithAIOptions: { training: false, phishing: true }
    }
    Groups.methods.handleCloseSendWithAIDialog.call(ctx)
    expect(ctx.isSendWithAISubmitting).toBe(false)
    expect(ctx.isSendWithAIDialogOpen).toBe(false)
    expect(ctx.selectedRowForAI).toBe(null)
  })

  it('handleConfirmSendWithAI keeps isSendWithAISubmitting true until batch API resolves', async () => {
    let resolveApi
    sendBatchAutonomous.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveApi = resolve
        })
    )
    const ctx = {
      selectedRowForAI: { resourceId: 'g-pending' },
      agenticAIDialogMode: 'approval',
      handleCloseSendWithAIDialog: jest.fn(),
      getSendWithAISuccessMessage: Groups.methods.getSendWithAISuccessMessage,
      $store: { dispatch: jest.fn() },
      isSendWithAISubmitting: false,
      isTargetGroupEmpty: Groups.methods.isTargetGroupEmpty,
      getTargetGroupUserCount: Groups.methods.getTargetGroupUserCount
    }
    const pending = Groups.methods.handleConfirmSendWithAI.call(ctx, {
      training: true,
      phishing: false
    })
    expect(ctx.isSendWithAISubmitting).toBe(true)
    resolveApi({ data: {} })
    await pending
    await flushPromises()
    expect(ctx.isSendWithAISubmitting).toBe(false)
  })
})
