import { shallowMount } from '@vue/test-utils'
import ExecutiveReportScheduleReportDialog from '@/components/ExecutiveReports/ExecutiveReportScheduleReportDialog.vue'
import ReportsService, {
  createReportScheduling,
  getSchedulingReportManagers
} from '@/api/reports'

jest.mock('@/api/reports', () => ({
  __esModule: true,
  default: {
    getExecutiveReports: jest.fn(() => Promise.resolve({ data: { data: [] } })),
    getReportScheduling: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    getSchedulingReportTargetGroups: jest.fn(() => Promise.resolve({ data: { data: [] } })),
    createReportScheduling: jest.fn(() => Promise.resolve()),
    updateReportScheduling: jest.fn(() => Promise.resolve())
  },
  createReportScheduling: jest.fn(() => Promise.resolve()),
  getSchedulingReportManagers: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

jest.mock('@/utils/functions', () => ({
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm'),
  getTimeZoneForMoment: jest.fn(() => 'YYYY/MM/DD HH:mm')
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('ExecutiveReportScheduleReportDialog.vue', () => {
  const createWrapper = (propsData = {}, storeOverrides = {}) =>
    shallowMount(ExecutiveReportScheduleReportDialog, {
      propsData: {
        status: true,
        selectedRow: { resourceId: 'sch-1', name: 'Scheduled Report' },
        isNew: false,
        isReportSaved: false,
        isDuplicate: false,
        isEdit: false,
        isScheduledPage: false,
        isSupportManager: false,
        ...propsData
      },
      stubs: {
        AppModal: true,
        AppModalFooter: true,
        AppModalBodyHeader: true,
        InputEntityName: true,
        FormGroup: true,
        KSelect: true,
        InputDate: true,
        VForm: true,
        VAutocomplete: true,
        VSwitch: true,
        VIcon: true,
        VBtn: true
      },
      mocks: {
        $store: {
          getters: {
            'common/getTimezones': {
              timeZoneList: [{ id: 'tz-1', displayName: 'UTC' }]
            },
            'common/getSelectedTimeZone': 'tz-1',
            ...storeOverrides.getters
          },
          dispatch: jest.fn(),
          ...storeOverrides
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes title/body text for new, edit and duplicate states', () => {
    const base = createWrapper({ isDuplicate: false, isEdit: false })
    expect(base.vm.getTitle).toBe('New Schedule Report')
    expect(base.vm.getBodySubtitle).toContain('new scheduled report')

    const edit = createWrapper({ isEdit: true })
    expect(edit.vm.getTitle).toBe('Edit Schedule Report')
    expect(edit.vm.getBodyTitle).toBe('Edit Schedule Report')

    const duplicate = createWrapper({ isDuplicate: true })
    expect(duplicate.vm.getTitle).toBe('Duplicate Schedule Report')
    expect(duplicate.vm.getBodySubtitle).toContain('duplicated scheduled report')
  })

  it('computes getTime and manager-section visibility correctly', async () => {
    const ctx = {
      isScheduledPage: true,
      formData: { schedule: '2026/02/19 10:30 AM' },
      scheduledPageFormData: { reportResourceId: 'rep-2' },
      reportItems: [{ text: 'Report 2', value: 'rep-2', isSupportManager: true }]
    }
    const getTime = ExecutiveReportScheduleReportDialog.computed.getTime.call(ctx)
    const selectedSupport =
      ExecutiveReportScheduleReportDialog.computed.selectedReportIsSupportManager.call(ctx)
    const shouldShow = ExecutiveReportScheduleReportDialog.computed.shouldShowManagerSection.call({
      ...ctx,
      selectedReportIsSupportManager: selectedSupport,
      isSupportManager: false
    })

    expect(getTime).toBe('10:30 AM')
    expect(selectedSupport).toBe(true)
    expect(shouldShow).toBe(true)
  })

  it('callForManagers maps manager list and falls back to empty array on error', async () => {
    const wrapper = createWrapper()
    getSchedulingReportManagers.mockResolvedValueOnce({
      data: { data: [{ fullName: 'John Doe', email: 'john@x.com' }, { email: 'jane@x.com' }] }
    })

    wrapper.vm.callForManagers()
    await flushPromises()
    expect(wrapper.vm.managerItems).toEqual([
      { text: 'John Doe', value: 'john@x.com' },
      { text: 'jane@x.com', value: 'jane@x.com' }
    ])

    getSchedulingReportManagers.mockRejectedValueOnce(new Error('failed'))
    wrapper.vm.callForManagers()
    await flushPromises()
    expect(wrapper.vm.managerItems).toEqual([])
  })

  it('handleConfirm returns early when form validation fails', () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.refForm = { validate: jest.fn(() => false) }
    const submitSpy = jest.spyOn(wrapper.vm, 'submitScheduled')

    wrapper.vm.handleConfirm()

    expect(submitSpy).not.toHaveBeenCalled()
    expect(createReportScheduling).not.toHaveBeenCalled()
  })

  it('handleConfirm shows snackbar when manager mode has no manager selected', async () => {
    const wrapper = createWrapper({ isSupportManager: true })
    wrapper.vm.$refs.refForm = { validate: jest.fn(() => true) }
    await wrapper.setData({
      formData: {
        ...wrapper.vm.formData,
        schedule: '2026/02/19 10:00',
        scheduledDateTimeZoneId: 'tz-1',
        managerEmails: []
      }
    })

    wrapper.vm.handleConfirm()

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Please select at least one manager.' })
    )
  })

  it('handleConfirm shows snackbar when no email and no target group selected', async () => {
    const wrapper = createWrapper({ isSupportManager: false })
    wrapper.vm.$refs.refForm = { validate: jest.fn(() => true) }
    await wrapper.setData({
      formData: {
        ...wrapper.vm.formData,
        schedule: '2026/02/19 10:00',
        scheduledDateTimeZoneId: 'tz-1',
        emailAddresses: [],
        targetGroupResourceIds: []
      }
    })

    wrapper.vm.handleConfirm()

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        message:
          'Please send the report either to email or to a target group. You must choose at least one of these options.'
      })
    )
  })

  it('handleConfirm emits on-submit for new unsaved report flow', async () => {
    const wrapper = createWrapper({ isNew: true, isReportSaved: false })
    wrapper.vm.$refs.refForm = { validate: jest.fn(() => true) }
    await wrapper.setData({
      formData: {
        ...wrapper.vm.formData,
        schedule: '2026/02/19 10:00',
        scheduledDateTimeZoneId: 'tz-1',
        emailAddresses: ['a@x.com']
      }
    })

    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-submit')).toBeTruthy()
    expect(createReportScheduling).not.toHaveBeenCalled()
  })

  it('handleConfirm calls createReportScheduling for existing report flow', async () => {
    const wrapper = createWrapper({ isNew: false, isReportSaved: false })
    wrapper.vm.$refs.refForm = { validate: jest.fn(() => true) }
    await wrapper.setData({
      formData: {
        ...wrapper.vm.formData,
        schedule: '2026/02/19 10:00',
        scheduledDateTimeZoneId: 'tz-1',
        emailAddresses: ['a@x.com']
      }
    })

    wrapper.vm.handleConfirm()
    await flushPromises()

    expect(createReportScheduling).toHaveBeenCalledWith(
      expect.objectContaining({
        reportType: 2,
        reportResourceId: 'sch-1'
      })
    )
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('submitScheduled uses create when not edit or duplicate and update when edit', async () => {
    const createWrapperInstance = createWrapper({ isScheduledPage: false, isEdit: false, isDuplicate: false })
    await createWrapperInstance.setData({
      formData: { ...createWrapperInstance.vm.formData, emailAddresses: ['a@x.com'] },
      scheduledPageFormData: { reportType: 2, reportResourceId: 'rep-1' }
    })

    createWrapperInstance.vm.submitScheduled()
    await flushPromises()
    expect(ReportsService.createReportScheduling).toHaveBeenCalled()
    expect(createWrapperInstance.emitted('on-save-close')).toBeTruthy()

    const editWrapper = createWrapper({ isScheduledPage: false, isEdit: true, isDuplicate: false })
    await editWrapper.setData({
      formData: { ...editWrapper.vm.formData, emailAddresses: ['b@x.com'] },
      scheduledPageFormData: { reportType: 2, reportResourceId: 'rep-2' }
    })

    editWrapper.vm.submitScheduled()
    await flushPromises()
    expect(ReportsService.updateReportScheduling).toHaveBeenCalledWith(
      expect.objectContaining({ reportResourceId: 'rep-2' }),
      'sch-1'
    )
    expect(editWrapper.emitted('on-save-close')).toBeTruthy()
  })
})
