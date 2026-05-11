import { shallowMount } from '@vue/test-utils'
import LandingPageList from '@/components/LandingPage/LandingPageList.vue'
import LandingPageTemplateModalPreview from '@/components/LandingPage/LandingPageTemplateModalPreview.vue'
import CommonSimulatorLandingPageTemplatesPreviewDialog from '@/components/Common/Simulator/LandingPageTemplates/CommonSimulatorLandingPageTemplatesPreviewDialog.vue'
import ScenariosRowActionsEditButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsEditButton.vue'

describe('Landing page owner edit guard (integration)', () => {
  it('keeps landing page edit disabled for non-owner rows across table, preview, drawer, and handler', () => {
    const row = { resourceId: 'landing-page-1', name: 'Landing Page', isOwner: false }
    const editAction = shallowMount(ScenariosRowActionsEditButton, {
      propsData: {
        scope: { row },
        disabled: false
      }
    })

    expect(editAction.vm.getDisabledStatusOfAction).toBe(true)
    expect(
      LandingPageTemplateModalPreview.computed.showEditButton.call({
        isNested: false,
        disableEdit: false,
        isOwner: row.isOwner
      })
    ).toBe(false)

    const previewEmit = jest.fn()
    LandingPageTemplateModalPreview.methods.handleEdit.call({
      showEditButton: false,
      $emit: previewEmit
    })
    expect(previewEmit).not.toHaveBeenCalled()

    const drawerEmit = jest.fn()
    const drawerCtx = {
      selectedRow: row,
      disableEdit: false,
      isHtmlOverflowControlManuallyDisabled: false,
      $emit: drawerEmit
    }
    CommonSimulatorLandingPageTemplatesPreviewDialog.methods.handleEdit.call(drawerCtx)
    expect(drawerEmit).not.toHaveBeenCalled()
    expect(drawerCtx.isHtmlOverflowControlManuallyDisabled).toBe(false)

    const listCtx = {
      modalStatus: false,
      isEdit: false,
      isDuplicate: false,
      emailTemplateId: null
    }
    LandingPageList.methods.handleEdit.call(listCtx, row, false)
    expect(listCtx.modalStatus).toBe(false)
    expect(listCtx.emailTemplateId).toBe(null)
  })

  it('allows landing page edit for owner rows across table, preview, drawer, and handler', () => {
    const row = { resourceId: 'landing-page-1', name: 'Landing Page', isOwner: true }
    const editAction = shallowMount(ScenariosRowActionsEditButton, {
      propsData: {
        scope: { row },
        disabled: false
      }
    })

    expect(editAction.vm.getDisabledStatusOfAction).toBe(false)
    expect(
      LandingPageTemplateModalPreview.computed.showEditButton.call({
        isNested: false,
        disableEdit: false,
        isOwner: row.isOwner
      })
    ).toBe(true)

    const previewEmit = jest.fn()
    LandingPageTemplateModalPreview.methods.handleEdit.call({
      showEditButton: true,
      $emit: previewEmit
    })
    expect(previewEmit).toHaveBeenCalledWith('edit')

    const drawerEmit = jest.fn()
    const drawerCtx = {
      selectedRow: row,
      disableEdit: false,
      isHtmlOverflowControlManuallyDisabled: false,
      $emit: drawerEmit
    }
    CommonSimulatorLandingPageTemplatesPreviewDialog.methods.handleEdit.call(drawerCtx)
    expect(drawerEmit).toHaveBeenCalledWith('on-edit', row)
    expect(drawerCtx.isHtmlOverflowControlManuallyDisabled).toBe(true)

    const listCtx = {
      modalStatus: false,
      isEdit: false,
      isDuplicate: false,
      emailTemplateId: null
    }
    LandingPageList.methods.handleEdit.call(listCtx, row, false)
    expect(listCtx.modalStatus).toBe(true)
    expect(listCtx.emailTemplateId).toBe('landing-page-1')
  })
})
