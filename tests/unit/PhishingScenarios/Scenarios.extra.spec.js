import Scenarios from '@/components/PhishingScenarios/Scenarios.vue'

describe('PhishingScenarios/Scenarios.vue (extra)', () => {
  describe('row handler null safety - rage click / invalid row guards', () => {
    describe('handleFastLaunch', () => {
      it('returns early when row is null', () => {
        const ctx = {
          selectedRow: null,
          toggleShowFastLaunch: jest.fn(),
          isShowPreviewDialog: false,
          toggleShowPreviewDialog: jest.fn()
        }
        Scenarios.methods.handleFastLaunch.call(ctx, null)
        expect(ctx.selectedRow).toBeNull()
        expect(ctx.toggleShowFastLaunch).not.toHaveBeenCalled()
      })

      it('returns early when row is undefined', () => {
        const ctx = {
          selectedRow: null,
          toggleShowFastLaunch: jest.fn()
        }
        Scenarios.methods.handleFastLaunch.call(ctx, undefined)
        expect(ctx.toggleShowFastLaunch).not.toHaveBeenCalled()
      })

      it('returns early when row is not an object (string)', () => {
        const ctx = {
          selectedRow: null,
          toggleShowFastLaunch: jest.fn()
        }
        Scenarios.methods.handleFastLaunch.call(ctx, 'invalid')
        expect(ctx.toggleShowFastLaunch).not.toHaveBeenCalled()
      })

      it('proceeds when row is valid object', () => {
        const row = { resourceId: 's-1', name: 'Test' }
        const ctx = {
          selectedRow: null,
          toggleShowFastLaunch: jest.fn(),
          isShowPreviewDialog: false
        }
        Scenarios.methods.handleFastLaunch.call(ctx, row)
        expect(ctx.selectedRow).toEqual(row)
        expect(ctx.toggleShowFastLaunch).toHaveBeenCalled()
      })
    })

    describe('handlePreview', () => {
      it('returns early when row is undefined', () => {
        const ctx = {
          selectedPhishingScenario: { resourceId: 's-old' },
          toggleShowPreviewDialog: jest.fn()
        }
        Scenarios.methods.handlePreview.call(ctx, undefined)
        expect(ctx.selectedPhishingScenario).toEqual({ resourceId: 's-old' })
        expect(ctx.toggleShowPreviewDialog).not.toHaveBeenCalled()
      })

      it('returns early when row is not an object', () => {
        const ctx = {
          selectedPhishingScenario: {},
          toggleShowPreviewDialog: jest.fn()
        }
        Scenarios.methods.handlePreview.call(ctx, 123)
        expect(ctx.toggleShowPreviewDialog).not.toHaveBeenCalled()
      })
    })

    describe('handleEdit', () => {
      it('returns early when row is null', () => {
        const ctx = {
          selectedRow: null,
          editableFormValues: {},
          modalStatus: false,
          isEdit: false,
          isDuplicate: false,
          scenarioId: null
        }
        Scenarios.methods.handleEdit.call(ctx, null, false)
        expect(ctx.modalStatus).toBe(false)
        expect(ctx.scenarioId).toBeNull()
      })

      it('returns early when row is undefined', () => {
        const ctx = {
          modalStatus: false,
          scenarioId: null
        }
        Scenarios.methods.handleEdit.call(ctx, undefined, true)
        expect(ctx.modalStatus).toBe(false)
      })

      it('returns early when row is not an object', () => {
        const ctx = {
          modalStatus: false,
          scenarioId: null
        }
        Scenarios.methods.handleEdit.call(ctx, 'invalid', false)
        expect(ctx.modalStatus).toBe(false)
      })

      it('proceeds when row is valid', () => {
        const row = { resourceId: 's-edit', name: 'Scenario' }
        const ctx = {
          selectedRow: null,
          editableFormValues: {},
          modalStatus: false,
          isEdit: false,
          isDuplicate: false,
          scenarioId: null
        }
        Scenarios.methods.handleEdit.call(ctx, row, false)
        expect(ctx.selectedRow).toEqual(row)
        expect(ctx.modalStatus).toBe(true)
        expect(ctx.scenarioId).toBe('s-edit')
      })
    })

    describe('handleActionDelete', () => {
      it('returns early when row is null', () => {
        const ctx = {
          isMultipleDelete: true,
          selectedScenario: null,
          showDeleteModal: false
        }
        Scenarios.methods.handleActionDelete.call(ctx, null)
        expect(ctx.showDeleteModal).toBe(false)
        expect(ctx.selectedScenario).toBeNull()
      })

      it('returns early when row is undefined', () => {
        const ctx = {
          showDeleteModal: false,
          selectedScenario: null
        }
        Scenarios.methods.handleActionDelete.call(ctx, undefined)
        expect(ctx.showDeleteModal).toBe(false)
      })

      it('returns early when row is not an object', () => {
        const ctx = {
          showDeleteModal: false
        }
        Scenarios.methods.handleActionDelete.call(ctx, 0)
        expect(ctx.showDeleteModal).toBe(false)
      })

      it('proceeds when row is valid', () => {
        const row = { resourceId: 's-del' }
        const ctx = {
          isMultipleDelete: true,
          selectedScenario: null,
          showDeleteModal: false
        }
        Scenarios.methods.handleActionDelete.call(ctx, row)
        expect(ctx.selectedScenario).toEqual(row)
        expect(ctx.showDeleteModal).toBe(true)
      })
    })
  })
})
