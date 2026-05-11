import { shallowMount } from '@vue/test-utils'
import VishingTemplates from '@/views/VishingTemplates.vue'
import VishingTemplatePreview from '@/components/VishingTemplates/VishingTemplatePreview.vue'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction.vue'

describe('Vishing templates owner edit guard (integration)', () => {
  it('keeps vishing template edit disabled for non-owner rows across table, preview, and handler', () => {
    const row = { resourceId: 'template-1', name: 'Vishing Template', isOwner: false }
    const editAction = shallowMount(DefaultMenuRowAction, {
      propsData: {
        scope: { row },
        disabled: false
      }
    })

    expect(editAction.vm.isDisabled).toBe(true)
    expect(
      VishingTemplatePreview.computed.canShowEditButton.call({
        showEditButton: true,
        selectedRow: row
      })
    ).toBe(false)

    const emit = jest.fn()
    VishingTemplatePreview.methods.handleEdit.call({
      selectedRow: row,
      editDisabled: false,
      $emit: emit
    })
    expect(emit).not.toHaveBeenCalled()

    const ctx = {
      selectedTemplate: null,
      modalStatus: false,
      isEdit: false,
      isDuplicate: false,
      vishingTemplateId: null
    }

    VishingTemplates.methods.handleEdit.call(ctx, row, false)

    expect(ctx.modalStatus).toBe(false)
    expect(ctx.vishingTemplateId).toBe(null)
  })

  it('allows vishing template edit for owner rows across table, preview, and handler', () => {
    const row = { resourceId: 'template-1', name: 'Vishing Template', isOwner: true }
    const editAction = shallowMount(DefaultMenuRowAction, {
      propsData: {
        scope: { row },
        disabled: false
      }
    })

    expect(editAction.vm.isDisabled).toBe(false)
    expect(
      VishingTemplatePreview.computed.canShowEditButton.call({
        showEditButton: true,
        selectedRow: row
      })
    ).toBe(true)

    const emit = jest.fn()
    VishingTemplatePreview.methods.handleEdit.call({
      selectedRow: row,
      editDisabled: false,
      $emit: emit
    })
    expect(emit).toHaveBeenCalledWith('on-edit-template')

    const ctx = {
      selectedTemplate: null,
      modalStatus: false,
      isEdit: false,
      isDuplicate: false,
      vishingTemplateId: null
    }

    VishingTemplates.methods.handleEdit.call(ctx, row, false)

    expect(ctx.modalStatus).toBe(true)
    expect(ctx.vishingTemplateId).toBe('template-1')
  })
})
