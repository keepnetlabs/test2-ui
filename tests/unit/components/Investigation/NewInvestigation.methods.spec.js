jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    scrollToComponent: jest.fn(),
    isDifferent: jest.fn(() => false)
  }
})

import NewInvestigation from '@/components/Investigation/NewInvestigation.vue'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import {
  ACTION_TYPES,
  TARGET_USER_TYPES,
  OPERATORS,
  TEXT_OPERATORS
} from '@/components/Investigation/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('NewInvestigation.vue methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('changeStep moves to next step when settings form is valid', () => {
    const ctx = {
      step: 1,
      $refs: {
        refNewInvestigationSettings: {
          validateForm: jest.fn(() => true)
        }
      }
    }

    NewInvestigation.methods.changeStep.call(ctx, 1)

    expect(ctx.step).toBe(2)
  })

  it('changeStep applies backward navigation without validation check', () => {
    const ctx = {
      step: 2,
      $refs: {
        refNewInvestigationSettings: {
          validateForm: jest.fn(() => false)
        }
      }
    }

    NewInvestigation.methods.changeStep.call(ctx, -1)

    expect(ctx.step).toBe(1)
  })

  it('changeStep scrolls to error when settings form is invalid', () => {
    const scrollToErrorMessage = jest.fn()
    const ctx = {
      step: 1,
      scrollToErrorMessage,
      $refs: {
        refNewInvestigationSettings: {
          validateForm: jest.fn(() => false),
          $refs: { refForm: { $el: {} } }
        }
      }
    }

    NewInvestigation.methods.changeStep.call(ctx, 1)

    expect(ctx.step).toBe(1)
    expect(scrollToErrorMessage).toHaveBeenCalled()
  })

  it('scrollToErrorMessage selects error or date-row and scrolls', () => {
    const ctx = {
      $nextTick: (cb) => cb()
    }
    const errorEl = { className: 'error--text' }
    const el = {
      querySelector: jest
        .fn()
        .mockImplementationOnce(() => errorEl)
        .mockImplementationOnce(() => ({ className: 'date-row' }))
    }

    NewInvestigation.methods.scrollToErrorMessage.call(ctx, el)
    expect(scrollToComponent).toHaveBeenCalledWith(errorEl)
  })

  it('handleClose emits directly when form is unchanged', () => {
    isDifferent.mockReturnValueOnce(false)
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      $store: { dispatch: jest.fn() },
      initialFormData: { a: 1 },
      getCurrentFormData: jest.fn(() => ({ a: 1 }))
    }

    NewInvestigation.methods.handleClose.call(ctx)

    expect(emit).toHaveBeenCalledWith('closeAdd')
    expect(ctx.$store.dispatch).not.toHaveBeenCalled()
  })

  it('handleClose opens leaving dialog when form has changes', () => {
    isDifferent.mockReturnValueOnce(true)
    const emit = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      $emit: emit,
      $store: { dispatch },
      initialFormData: { a: 1 },
      getCurrentFormData: jest.fn(() => ({ a: 2 }))
    }

    NewInvestigation.methods.handleClose.call(ctx)

    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
    dispatch.mock.calls[0][1].callback()
    expect(emit).toHaveBeenCalledWith('closeAdd')
  })

  it('handleSubmit dispatches createInvestigation and emits success events on valid payload', async () => {
    const dispatch = jest.fn(() => Promise.resolve({ id: 'inv-1' }))
    const emit = jest.fn()
    const ctx = {
      isActionButtonDisabled: false,
      $store: { dispatch },
      $emit: emit,
      $refs: {
        refNewInvestigationSettings: {
          formData: {
            investigationName: 'Manual Inv',
            emailDateRange: ['2026-01-01', '2026-01-02'],
            duration: 'OneDay',
            targetUserType: TARGET_USER_TYPES.Users,
            targetUsersValue: ['u1'],
            scanTypes: [{ type: 'M365' }],
            action: ACTION_TYPES.Delete,
            warningMessage: 'warn'
          }
        },
        refNewInvestigationFilters: {
          validateForm: jest.fn(() => ({
            formValid: true,
            queryValid: true,
            filtersValid: { ipValid: true, fromValid: true }
          })),
          query: {
            logicalOperator: TEXT_OPERATORS.AND,
            children: [
              { query: { operand: 'from', value: 'a@acme.com' } },
              { query: { operand: 'subject', value: 'Urgent' } },
              { query: { operand: 'md5', value: 'hash1' } }
            ]
          }
        }
      }
    }

    NewInvestigation.methods.handleSubmit.call(ctx)
    await flushPromises()

    expect(dispatch).toHaveBeenCalledWith(
      'investigations/createInvestigation',
      expect.objectContaining({
        name: 'Manual Inv',
        startDate: '2026-01-01',
        endDate: '2026-01-02',
        logicalOperator: OPERATORS.AND
      })
    )
    expect(emit).toHaveBeenCalledWith('closeWithRoute', { id: 'inv-1' })
    expect(emit).toHaveBeenCalledWith('closeAdd', true)
    expect(ctx.isActionButtonDisabled).toBe(false)
  })

  it('handleSubmit scrolls form error when formValid is false', () => {
    const scrollToErrorMessage = jest.fn()
    const ctx = {
      scrollToErrorMessage,
      $refs: {
        refNewInvestigationSettings: { formData: {} },
        refNewInvestigationFilters: {
          validateForm: jest.fn(() => ({
            formValid: false,
            queryValid: true,
            filtersValid: { ipValid: true, fromValid: true }
          })),
          $refs: { refForm: { $el: {} } }
        }
      },
      $store: { dispatch: jest.fn() }
    }

    NewInvestigation.methods.handleSubmit.call(ctx)

    expect(scrollToErrorMessage).toHaveBeenCalled()
  })

  it('handleSubmit creates snackbar for duplicate from/ip filters', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: { dispatch },
      $refs: {
        refNewInvestigationSettings: { formData: {} },
        refNewInvestigationFilters: {
          validateForm: jest.fn(() => ({
            formValid: true,
            queryValid: true,
            filtersValid: { ipValid: false, fromValid: false }
          })),
          query: { logicalOperator: TEXT_OPERATORS.AND, children: [] }
        }
      }
    }

    NewInvestigation.methods.handleSubmit.call(ctx)

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ icon: 'mdi-alert-circle' })
    )
    expect(dispatch).toHaveBeenCalledTimes(2)
  })

  it('handleSubmit creates snackbar with filter error message when query is invalid', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: { dispatch },
      $refs: {
        refNewInvestigationSettings: { formData: {} },
        refNewInvestigationFilters: {
          validateForm: jest.fn(() => ({
            formValid: true,
            queryValid: false,
            filtersValid: { ipValid: true, fromValid: true }
          })),
          getErrorMessage: jest.fn(() => 'Invalid query')
        }
      }
    }

    NewInvestigation.methods.handleSubmit.call(ctx)

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Invalid query' })
    )
  })

  it('checkIsDuplicate maps details for Groups and applies form/query', () => {
    const setFormData = jest.fn()
    const setFormQuery = jest.fn()
    const getEditedFilters = jest.fn(() => [{ query: { operand: 'from', value: 'x' } }])
    const ctx = {
      isDuplicate: true,
      investigationDetailsData: {
        name: 'Inv Dup',
        scanConfigurationDetails: [{ mailConfigurationResourceId: 'm1', type: 'M365' }],
        duration: 'OneDay',
        targetUserType: TARGET_USER_TYPES.Groups,
        targetUsers: [{ targetUser: 'Group A', targetGroupResourceId: 'g1' }],
        logicalOperator: OPERATORS.OR
      },
      $refs: { refNewInvestigationSettings: { setFormData } },
      setFormQuery,
      getEditedFilters
    }

    NewInvestigation.methods.checkIsDuplicate.call(ctx)

    expect(setFormData).toHaveBeenCalledWith(
      expect.objectContaining({
        investigationName: 'Inv Dup',
        targetUsersValue: [{ name: 'Group A', resourceId: 'g1' }],
        selectedAction: ACTION_TYPES.NoAction
      })
    )
    expect(setFormQuery).toHaveBeenCalledWith(OPERATORS.OR, [{ query: { operand: 'from', value: 'x' } }])
  })

  it('checkIsDuplicate returns early when duplicate mode is disabled', () => {
    const ctx = {
      isDuplicate: false,
      $refs: { refNewInvestigationSettings: { setFormData: jest.fn() } },
      setFormQuery: jest.fn()
    }

    NewInvestigation.methods.checkIsDuplicate.call(ctx)

    expect(ctx.$refs.refNewInvestigationSettings.setFormData).not.toHaveBeenCalled()
    expect(ctx.setFormQuery).not.toHaveBeenCalled()
  })

  it('checkIsDuplicate maps details for Users target type', () => {
    const setFormData = jest.fn()
    const ctx = {
      isDuplicate: true,
      investigationDetailsData: {
        name: 'Inv Dup 2',
        scanConfigurationDetails: [{ mailConfigurationResourceId: 'm2', type: 'EWS' }],
        duration: 'OneDay',
        targetUserType: TARGET_USER_TYPES.Users,
        targetUsers: [{ targetUser: 'user1@acme.com' }],
        logicalOperator: OPERATORS.AND
      },
      $refs: { refNewInvestigationSettings: { setFormData } },
      setFormQuery: jest.fn(),
      getEditedFilters: jest.fn(() => [])
    }

    NewInvestigation.methods.checkIsDuplicate.call(ctx)

    expect(setFormData).toHaveBeenCalledWith(
      expect.objectContaining({
        targetUsersValue: ['user1@acme.com']
      })
    )
  })

  it('selected mail filter helpers return expected rule arrays', () => {
    const ctx = {
      isTs: true,
      isIr: false,
      selectedMail: {
        from: 'sender@acme.com',
        isFromHidden: false,
        isFromFlagged: true,
        subject: 'Subj',
        isSubjectHidden: false,
        isSubjectFlagged: true,
        bcc: ['b1@a.com'],
        isBccHidden: false,
        isBccFlagged: true,
        cc: ['c1@a.com'],
        isCcHidden: false,
        isCcFlagged: true,
        to: ['t1@a.com'],
        isToHidden: false,
        isToFlagged: true,
        urls: [{ url: 'https://a.com', isHidden: false, isFlagged: true }],
        attachments: [{ md5: 'm', sha512: 's', isHidden: false, isFlagged: true }],
        senderIp: '1.1.1.1'
      }
    }

    expect(NewInvestigation.methods.getSelectedMailFromFilter.call(ctx)).toHaveLength(1)
    expect(NewInvestigation.methods.getSelectedMailSubjectFilter.call(ctx)).toHaveLength(1)
    expect(NewInvestigation.methods.getSelectedMailBccFilter.call(ctx)).toHaveLength(1)
    expect(NewInvestigation.methods.getSelectedMailCcFilter.call(ctx)).toHaveLength(1)
    expect(NewInvestigation.methods.getSelectedMailToFilter.call(ctx)).toHaveLength(1)
    expect(NewInvestigation.methods.getSelectedMailUrlFilter.call(ctx)).toHaveLength(1)
    expect(NewInvestigation.methods.getSelectedMailAttachmentFilter.call(ctx)).toHaveLength(2)
    expect(NewInvestigation.methods.getSelectedMailSenderIpFilter.call(ctx)).toHaveLength(1)
  })

  it('checkIsSelectedMail maps IR payload and applies OR query', () => {
    const setFormQuery = jest.fn()
    const ctx = {
      isTs: false,
      isIr: true,
      selectedMail: {
        logicalOperator: OPERATORS.OR,
        notifiedEmailInvestigation: {
          urls: [{ url: 'https://ir-url.com' }],
          attachments: [{ md5: 'h1', sha512: 'h2' }]
        },
        from: 'sender@acme.com',
        subject: 'Subject',
        bcc: [],
        cc: [],
        to: ['to@acme.com'],
        senderIp: '1.1.1.1'
      },
      setFormQuery,
      getSelectedMailFromFilter: NewInvestigation.methods.getSelectedMailFromFilter,
      getSelectedMailSubjectFilter: NewInvestigation.methods.getSelectedMailSubjectFilter,
      getSelectedMailAttachmentFilter: NewInvestigation.methods.getSelectedMailAttachmentFilter,
      getSelectedMailBccFilter: NewInvestigation.methods.getSelectedMailBccFilter,
      getSelectedMailCcFilter: NewInvestigation.methods.getSelectedMailCcFilter,
      getSelectedMailToFilter: NewInvestigation.methods.getSelectedMailToFilter,
      getSelectedMailUrlFilter: NewInvestigation.methods.getSelectedMailUrlFilter,
      getSelectedMailSenderIpFilter: NewInvestigation.methods.getSelectedMailSenderIpFilter
    }

    NewInvestigation.methods.checkIsSelectedMail.call(ctx)

    expect(ctx.selectedMail.urls).toEqual([{ url: 'https://ir-url.com' }])
    expect(ctx.selectedMail.attachments).toEqual([{ md5: 'h1', sha512: 'h2' }])
    expect(setFormQuery).toHaveBeenCalledWith(OPERATORS.AND, expect.any(Array))
    const filterList = setFormQuery.mock.calls[0][1]
    expect(filterList.length).toBeGreaterThan(0)
  })

  it('checkIsSelectedMail returns early when selectedMail is missing', () => {
    const ctx = {
      selectedMail: null,
      setFormQuery: jest.fn()
    }

    NewInvestigation.methods.checkIsSelectedMail.call(ctx)

    expect(ctx.setFormQuery).not.toHaveBeenCalled()
  })

  it('getSelectedMailToFilter returns empty list for IR mode', () => {
    const ctx = {
      isTs: false,
      isIr: true,
      selectedMail: { to: ['a@acme.com'] }
    }

    expect(NewInvestigation.methods.getSelectedMailToFilter.call(ctx)).toEqual([])
  })

  it('selected mail helpers skip hidden/unflagged TS fields', () => {
    const ctx = {
      isTs: true,
      isIr: false,
      selectedMail: {
        from: 'a@acme.com',
        isFromHidden: true,
        isFromFlagged: true,
        subject: 'S',
        isSubjectHidden: false,
        isSubjectFlagged: false,
        bcc: ['b@acme.com'],
        isBccHidden: true,
        isBccFlagged: true,
        cc: ['c@acme.com'],
        isCcHidden: false,
        isCcFlagged: false,
        to: ['t@acme.com'],
        isToHidden: true,
        isToFlagged: true,
        urls: [{ url: 'https://a.com', isHidden: true, isFlagged: true }],
        attachments: [{ md5: 'm', sha512: 's', isHidden: false, isFlagged: false }]
      }
    }

    expect(NewInvestigation.methods.getSelectedMailFromFilter.call(ctx)).toEqual([])
    expect(NewInvestigation.methods.getSelectedMailSubjectFilter.call(ctx)).toEqual([])
    expect(NewInvestigation.methods.getSelectedMailBccFilter.call(ctx)).toEqual([])
    expect(NewInvestigation.methods.getSelectedMailCcFilter.call(ctx)).toEqual([])
    expect(NewInvestigation.methods.getSelectedMailToFilter.call(ctx)).toEqual([])
    expect(NewInvestigation.methods.getSelectedMailUrlFilter.call(ctx)).toEqual([])
    expect(NewInvestigation.methods.getSelectedMailAttachmentFilter.call(ctx)).toEqual([])
  })

  it('setInitialFormData snapshots current form data', () => {
    const ctx = {
      initialFormData: null,
      getCurrentFormData: jest.fn(() => ({ a: 1 }))
    }

    NewInvestigation.methods.setInitialFormData.call(ctx)

    expect(ctx.initialFormData).toEqual({ a: 1 })
  })

  it('setFormQuery maps operator text for AND and OR', () => {
    const setQuery = jest.fn()
    const ctx = {
      $refs: { refNewInvestigationFilters: { setQuery } }
    }
    const children = [{ query: { operand: 'from', value: 'x' } }]

    NewInvestigation.methods.setFormQuery.call(ctx, OPERATORS.AND, children)
    expect(setQuery).toHaveBeenCalledWith({
      logicalOperator: TEXT_OPERATORS.AND,
      children
    })

    NewInvestigation.methods.setFormQuery.call(ctx, OPERATORS.OR, children)
    expect(setQuery).toHaveBeenCalledWith({
      logicalOperator: TEXT_OPERATORS.OR,
      children
    })
  })

  it('getEditedFilters merges headers, bodies and attachments while skipping empty values', () => {
    const ctx = {
      investigationDetailsData: {
        headers: [{ from: 'x@a.com', resourceId: 'r1', subject: '' }],
        bodies: [{ body: 'hello', resourceId: 'r2' }],
        attachments: [{ md5: 'hash', resourceId: 'r3', sha512: null }]
      }
    }

    const result = NewInvestigation.methods.getEditedFilters.call(ctx)

    expect(result).toEqual([
      { query: { operand: 'from', value: 'x@a.com', rule: 'conditions' }, type: 'query-builder-rule' },
      { query: { operand: 'body', value: 'hello', rule: 'conditions' }, type: 'query-builder-rule' },
      { query: { operand: 'md5', value: 'hash', rule: 'conditions' }, type: 'query-builder-rule' }
    ])
  })
})
