import { shallowMount } from '@vue/test-utils'
import CallbackScenarios from '@/components/CallbackScenarios/CallbackScenarios.vue'
import CallbackScenarioPreview from '@/components/CallbackScenarios/CallbackScenarioPreview.vue'
import ScenariosRowActionsEditButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsEditButton.vue'

describe('Callback scenarios owner edit guard (integration)', () => {
  it('keeps callback scenario edit disabled for non-owner rows across table, preview, and handler', () => {
    const row = { resourceId: 'scenario-1', name: 'Callback Scenario', isOwner: false }
    const editAction = shallowMount(ScenariosRowActionsEditButton, {
      propsData: {
        scope: { row },
        disabled: false
      }
    })

    expect(editAction.vm.getDisabledStatusOfAction).toBe(true)
    expect(
      CallbackScenarioPreview.computed.showEditButton.call({
        selectedRow: row
      })
    ).toBe(false)
    const emit = jest.fn()
    CallbackScenarioPreview.methods.handleEdit.call({ selectedRow: row, $emit: emit })
    expect(emit).not.toHaveBeenCalled()

    const ctx = {
      selectedRow: null,
      editableFormValues: {},
      modalStatus: false,
      isEdit: false,
      isDuplicate: false,
      scenarioId: null
    }

    CallbackScenarios.methods.handleEdit.call(ctx, row, false)

    expect(ctx.modalStatus).toBe(false)
    expect(ctx.scenarioId).toBe(null)
  })

  it('allows callback scenario edit for owner rows across table, preview, and handler', () => {
    const row = { resourceId: 'scenario-1', name: 'Callback Scenario', isOwner: true }
    const editAction = shallowMount(ScenariosRowActionsEditButton, {
      propsData: {
        scope: { row },
        disabled: false
      }
    })

    expect(editAction.vm.getDisabledStatusOfAction).toBe(false)
    expect(
      CallbackScenarioPreview.computed.showEditButton.call({
        selectedRow: row
      })
    ).toBe(true)
    const emit = jest.fn()
    CallbackScenarioPreview.methods.handleEdit.call({ selectedRow: row, $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-edit-template')

    const ctx = {
      selectedRow: null,
      editableFormValues: {},
      modalStatus: false,
      isEdit: false,
      isDuplicate: false,
      scenarioId: null
    }

    CallbackScenarios.methods.handleEdit.call(ctx, row, false)

    expect(ctx.modalStatus).toBe(true)
    expect(ctx.scenarioId).toBe('scenario-1')
  })
})
