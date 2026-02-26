jest.mock('@/api/targetUsers', () => ({
  updateTransactionId: jest.fn(() => Promise.resolve({ data: { data: { transactionId: 'new-tx' } } }))
}))

import TargetUserImportFromAFile from '@/components/TargetUsers/TargetUserImportFromAFile.vue'
import labels from '@/model/constants/labels'
import { updateTransactionId } from '@/api/targetUsers'

describe('TargetUserImportFromAFile.vue (extra branches)', () => {
  const { computed, methods } = TargetUserImportFromAFile

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getDialogBodyForExceed prefers activeUserCount and falls back to totalUserCount', () => {
    const withActive = computed.getDialogBodyForExceed.call({
      companyLicense: { licenseLimit: 100, activeUserCount: 12, totalUserCount: 50 }
    })
    const withTotal = computed.getDialogBodyForExceed.call({
      companyLicense: { licenseLimit: 100, totalUserCount: 50 }
    })
    const withoutLicense = computed.getDialogBodyForExceed.call({ companyLicense: null })

    expect(withActive).toContain('Current target user count is 12')
    expect(withTotal).toContain('Current target user count is 50')
    expect(withoutLicense).toBe('')
  })

  it('isNextStepDisabled covers loading, invalid step1 and transaction fallback branches', () => {
    expect(
      computed.isNextStepDisabled.call({
        step1Loading: true,
        step2Loading: false,
        activeStep: 1,
        isValidUserFile: true,
        excelInfo: { transactionId: 'tx-1' }
      })
    ).toBe(true)

    expect(
      computed.isNextStepDisabled.call({
        step1Loading: false,
        step2Loading: false,
        activeStep: 1,
        isValidUserFile: false,
        excelInfo: { transactionId: 'tx-1' }
      })
    ).toBe(true)

    expect(
      computed.isNextStepDisabled.call({
        step1Loading: false,
        step2Loading: false,
        activeStep: 2,
        isValidUserFile: true,
        excelInfo: { transactionId: 'tx-1' }
      })
    ).toBe(false)

    expect(
      computed.isNextStepDisabled.call({
        step1Loading: false,
        step2Loading: false,
        activeStep: 2,
        isValidUserFile: true,
        excelInfo: null
      })
    ).toBe(true)
  })

  it('getLabelCount returns values for all supported labels and empty for unknown', () => {
    const ctx = {
      $refs: {
        refValidateList: {
          getSelectedMultipleValues: jest.fn(() => [{ resourceId: 'a' }, { resourceId: 'b' }])
        }
      },
      mappingStatus: { newUserCount: 3, existingUserCount: 4 },
      responsNumbers: { newUserCount: 5, existingUserCount: 6 }
    }

    expect(methods.getLabelCount.call(ctx, labels.ImportSelected)).toBe(2)
    expect(methods.getLabelCount.call(ctx, labels.ImportAll)).toBe(7)
    expect(methods.getLabelCount.call(ctx, 'onlyImportNewUsers')).toBe(5)
    expect(methods.getLabelCount.call(ctx, 'onlyUpdateExistingUsers')).toBe(6)
    expect(methods.getLabelCount.call(ctx, 'unknown-action')).toBe('')
  })

  it('nextStep returns false and opens required-area modal when required mapping is missing', () => {
    const ctx = {
      activeStep: 2,
      totalStep: 3,
      mappingData: {
        headers: [{ selectedValue: { dbName: 'FirstName' } }],
        columns: [{ required: true, dbName: 'Email' }]
      },
      requiredFields: [],
      showRequiredAreaModal: false
    }

    const result = methods.nextStep.call(ctx)

    expect(result).toBe(false)
    expect(ctx.requiredFields).toEqual(['Email'])
    expect(ctx.showRequiredAreaModal).toBe(true)
    expect(ctx.activeStep).toBe(2)
  })

  it('nextStep advances from step1 and triggers excel-data loading flow', () => {
    const getUploadedExcelData = jest.fn()
    const ctx = {
      activeStep: 1,
      totalStep: 3,
      formData: { file: { name: 'users.xlsx' } },
      step2Loading: false,
      getUploadedExcelData
    }

    const result = methods.nextStep.call(ctx)

    expect(result).toBe(true)
    expect(ctx.activeStep).toBe(2)
    expect(ctx.step2Loading).toBe(true)
    expect(getUploadedExcelData).toHaveBeenCalled()
  })

  it('cancelButtonClick toggles confirm dialog when excel exists, otherwise closes overlay', () => {
    const closeOverlay = jest.fn()
    const uploadedCtx = {
      isExcelUploaded: true,
      closeTargetUserImport: false,
      isLeaveAccepted: false,
      closeOverlay
    }
    methods.cancelButtonClick.call(uploadedCtx)
    expect(uploadedCtx.closeTargetUserImport).toBe(true)
    expect(closeOverlay).not.toHaveBeenCalled()

    const plainCtx = {
      isExcelUploaded: false,
      closeTargetUserImport: false,
      isLeaveAccepted: false,
      closeOverlay
    }
    methods.cancelButtonClick.call(plainCtx)
    expect(plainCtx.isLeaveAccepted).toBe(true)
    expect(closeOverlay).toHaveBeenCalled()
  })

  it('updateTransactionId uses new transaction id when api returns one', async () => {
    updateTransactionId.mockResolvedValueOnce({ data: { data: { transactionId: 'tx-new-1' } } })
    const ctx = {
      excelInfo: { transactionId: 'tx-old-1' }
    }

    methods.updateTransactionId.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(updateTransactionId).toHaveBeenCalledWith('tx-old-1')
    expect(ctx.excelInfo.transactionId).toBe('tx-new-1')
  })

  it('updateTransactionId falls back to old id when api returns empty or rejects', async () => {
    updateTransactionId.mockResolvedValueOnce({ data: { data: {} } })
    const emptyResponseCtx = {
      excelInfo: { transactionId: 'tx-old-2' }
    }
    methods.updateTransactionId.call(emptyResponseCtx)
    await Promise.resolve()
    await Promise.resolve()
    expect(emptyResponseCtx.excelInfo.transactionId).toBe('tx-old-2')

    updateTransactionId.mockRejectedValueOnce(new Error('fail'))
    const rejectedCtx = {
      excelInfo: { transactionId: 'tx-old-3' }
    }
    methods.updateTransactionId.call(rejectedCtx)
    await Promise.resolve()
    await Promise.resolve()
    expect(rejectedCtx.excelInfo.transactionId).toBe('tx-old-3')
  })

  it('prevStep clamps at step 1 and does not call reset/update hooks', () => {
    const resetDisabledValuesFromColumns = jest.fn()
    const updateTransactionIdSpy = jest.fn()
    const resetBodyData = jest.fn()
    const ctx = {
      activeStep: 1,
      tableData: [{ id: 1 }],
      resetDisabledValuesFromColumns,
      updateTransactionId: updateTransactionIdSpy,
      resetBodyData
    }

    methods.prevStep.call(ctx)

    expect(ctx.activeStep).toBe(1)
    expect(ctx.tableData).toEqual([{ id: 1 }])
    expect(resetDisabledValuesFromColumns).not.toHaveBeenCalled()
    expect(updateTransactionIdSpy).not.toHaveBeenCalled()
    expect(resetBodyData).not.toHaveBeenCalled()
  })

  it('prevStep from step 3 goes to step 2 and runs transaction/body resets', () => {
    const resetDisabledValuesFromColumns = jest.fn()
    const updateTransactionIdSpy = jest.fn()
    const resetBodyData = jest.fn()
    const ctx = {
      activeStep: 3,
      tableData: [{ id: 1 }],
      resetDisabledValuesFromColumns,
      updateTransactionId: updateTransactionIdSpy,
      resetBodyData
    }

    methods.prevStep.call(ctx)

    expect(ctx.activeStep).toBe(2)
    expect(updateTransactionIdSpy).toHaveBeenCalled()
    expect(resetBodyData).toHaveBeenCalled()
    expect(resetDisabledValuesFromColumns).not.toHaveBeenCalled()
  })

  it('beforeRouteLeave blocks navigation only when excel is uploaded', () => {
    const nextBlocked = jest.fn()
    TargetUserImportFromAFile.beforeRouteLeave.call(
      { isExcelUploaded: true, isLeaveAccepted: false },
      {},
      {},
      nextBlocked
    )
    expect(nextBlocked).toHaveBeenCalledWith(false)

    const nextAllowed = jest.fn()
    TargetUserImportFromAFile.beforeRouteLeave.call(
      { isExcelUploaded: false, isLeaveAccepted: false },
      {},
      {},
      nextAllowed
    )
    expect(nextAllowed).toHaveBeenCalledWith()
  })
})
