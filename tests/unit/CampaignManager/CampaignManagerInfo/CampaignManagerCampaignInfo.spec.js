import CampaignManagerCampaignInfo from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerCampaignInfo.vue'

// Mocking external functions
jest.mock('@/utils/functions', () => ({
  scrollToComponent: jest.fn(),
  getDefaultAxiosPayload: jest.fn(val => val),
  getSelectSearchPayload: jest.fn((payload, search) => ({ ...payload, search })),
  cancellableAxiosRequest: jest.fn((fn) => (...args) => fn(...args)),
  createRandomCryptStringNumber: jest.fn(() => '1')
}))

jest.mock('@/api/targetUsers', () => ({
  searchTargetGroups: jest.fn(),
  createTargetGroup: jest.fn()
}))

describe('CampaignManagerCampaignInfo.vue', () => {
  let ctx

  beforeEach(() => {
    ctx = {
      $emit: jest.fn(),
      $nextTick: jest.fn((cb) => cb()),
      formData: {
        name: ''
      },
      targetGroupList: [],
      targetGroups: [],
      targetGroupPayload: {
        pageNumber: 1
      },
      isTargetGroupsLoading: false,
      isTargetGroupModalVisible: true,
      isCreateTargetGroupButtonDisabled: false,
      totalNumberOfPagesOfTargetGroups: 5,
      setTargetGroups: CampaignManagerCampaignInfo.methods.setTargetGroups,
      callForTargetGroups: jest.fn(),
      $refs: {
        refForm: {
          validate: jest.fn(),
          $el: {
            querySelector: jest.fn(() => 'mock-error-element')
          }
        },
        refTargetGroupSelect: {
          $refs: {
            refComponent: {
              isMenuActive: true
            }
          }
        }
      }
    }
    jest.clearAllMocks()
  })

  describe('Lifecycle Hooks', () => {
    it('created hook calls callForTargetGroups and emits initialFormValues', () => {
      CampaignManagerCampaignInfo.created.call(ctx)
      expect(ctx.$emit).toHaveBeenCalledWith('initialFormValues', expect.any(Object))
      expect(ctx.callForTargetGroups).toHaveBeenCalled()
    })
  })

  describe('Methods', () => {
    describe('handleCreateGroup', () => {
      it('opens modal and disables active menu of KSelect if ref exists', () => {
        CampaignManagerCampaignInfo.methods.handleCreateGroup.call(ctx)
        expect(ctx.isTargetGroupModalVisible).toBe(true)
        expect(ctx.$refs.refTargetGroupSelect.$refs.refComponent.isMenuActive).toBe(false)
      })

      it('opens modal but does not throw error if ref does not exist', () => {
        ctx.$refs = {}
        expect(() => {
          CampaignManagerCampaignInfo.methods.handleCreateGroup.call(ctx)
        }).not.toThrow()
        expect(ctx.isTargetGroupModalVisible).toBe(true)
      })
    })

    describe('handleCloseTargetGroupModal', () => {
      it('closes the modal', () => {
        CampaignManagerCampaignInfo.methods.handleCloseTargetGroupModal.call(ctx)
        expect(ctx.isTargetGroupModalVisible).toBe(false)
      })
    })

    describe('handleConfirmTargetGroupModal', () => {
      it('creates group and emits updates on success', async () => {
        const { createTargetGroup } = require('@/api/targetUsers')
        createTargetGroup.mockResolvedValueOnce({
          data: { data: { resourceId: 'new-id' } }
        })

        const group = { name: 'new group' }
        await CampaignManagerCampaignInfo.methods.handleConfirmTargetGroupModal.call(ctx, group)
        
        expect(ctx.$emit).toHaveBeenCalledWith('smartGroupSelected', group)
        expect(ctx.isTargetGroupModalVisible).toBe(false)
        expect(ctx.targetGroupList[0]).toEqual({ name: 'new group', resourceId: 'new-id' })
        expect(ctx.$emit).toHaveBeenCalledWith('update:clickedUserGroupResourceId', 'new-id')
        // finally block handles disabling button
        expect(ctx.isCreateTargetGroupButtonDisabled).toBe(false)
      })
    })

    describe('callForTargetGroups', () => {
      const { searchTargetGroups } = require('@/api/targetUsers')
      
      it('increments pageNumber if addPage is true and prevents fetching if beyond total pages', () => {
        ctx.targetGroupPayload.pageNumber = 5
        CampaignManagerCampaignInfo.methods.callForTargetGroups.call(ctx, true)
        expect(ctx.targetGroupPayload.pageNumber).toBe(6)
        expect(searchTargetGroups).not.toHaveBeenCalled()
      })

      it('searches target groups and updates variables properly', async () => {
        searchTargetGroups.mockResolvedValueOnce({
          data: { totalNumberOfPages: 2, data: { results: [{ name: 'G2', resourceId: '2' }] } }
        })
        ctx.setTargetGroups = jest.fn() // mock local assignment function

        await CampaignManagerCampaignInfo.methods.callForTargetGroups.call(ctx, false)

        expect(ctx.isTargetGroupsLoading).toBe(false)
        expect(ctx.totalNumberOfPagesOfTargetGroups).toBe(2)
      })
      
      it('survives empty data fallback gracefully', async () => {
        searchTargetGroups.mockResolvedValueOnce({})
        ctx.setTargetGroups = jest.fn()

        await CampaignManagerCampaignInfo.methods.callForTargetGroups.call(ctx, false)

        expect(ctx.isTargetGroupsLoading).toBe(false)
        expect(ctx.totalNumberOfPagesOfTargetGroups).toBe(1)
      })
    })

    describe('searchTargetGroups', () => {
      it('appends search criteria to payload and executes search via API', async () => {
        const { searchTargetGroups } = require('@/api/targetUsers')
        searchTargetGroups.mockResolvedValueOnce({
          data: { totalNumberOfPages: 1, data: { results: [] } }
        })
        ctx.setTargetGroups = jest.fn()

        await CampaignManagerCampaignInfo.methods.searchTargetGroups.call(ctx, 'foo filter')
        
        expect(searchTargetGroups).toHaveBeenCalledWith({
          pageNumber: 1,
          search: 'foo filter'
        })
        expect(ctx.isTargetGroupsLoading).toBe(false)
        expect(ctx.callForTargetGroups).not.toHaveBeenCalled()
      })
    })

    describe('setInitialName', () => {
      it('modifies formDataname and emits initial form values clone', () => {
        CampaignManagerCampaignInfo.methods.setInitialName.call(ctx, 'init')
        expect(ctx.formData.name).toBe('init')
        expect(ctx.$emit).toHaveBeenCalledWith('initialFormValues', expect.any(Object))
      })
    })

    describe('validateForm', () => {
      const { scrollToComponent } = require('@/utils/functions')

      it('returns true if form validates perfectly without scrolling', () => {
        ctx.$refs.refForm.validate.mockReturnValue(true)
        const res = CampaignManagerCampaignInfo.methods.validateForm.call(ctx)
        expect(res).toBe(true)
        expect(ctx.$nextTick).not.toHaveBeenCalled()
      })

      it('scrolls to invalid entry via nextTick when not valid', () => {
        ctx.$refs.refForm.validate.mockReturnValue(false)
        const res = CampaignManagerCampaignInfo.methods.validateForm.call(ctx)
        
        expect(res).toBe(false)
        expect(scrollToComponent).toHaveBeenCalledWith('mock-error-element')
      })
    })
  })

  // Data properties
  describe('validation rules', () => {
    let rules
    beforeEach(() => {
      rules = CampaignManagerCampaignInfo.data().rules
    })

    it('validates rule name accurately', () => {
      expect(typeof rules.name[0]('something')).toBe('boolean')
      expect(typeof rules.name[1](' something')).toBe('string')
      expect(rules.name[1]('something')).toBe(true) 
      expect(typeof rules.name[2]('something')).toBe('boolean')
    })
    
    it('validates rule select accurately', () => {
      expect(rules.select[0]([])).toBe('Required')
      expect(rules.select[0]([1])).toBe(true)
      
      expect(rules.select[1](' something')).toBe('Cannot start with space')
      expect(rules.select[1]('something')).toBe(true)
    })
  })

  describe('Watchers', () => {
    it('initialClickedUserGroupResourceId sets the parameter and calls for target groups if valid', () => {
      CampaignManagerCampaignInfo.watch.initialClickedUserGroupResourceId.handler.call(ctx, 'res1')
      expect(ctx.targetGroupPayload.selectTargetUserResourceIds).toBe('res1')
      expect(ctx.callForTargetGroups).toHaveBeenCalled()
    })
    it('initialClickedUserGroupResourceId does not trigger group fetch if not passed properly', () => {
      CampaignManagerCampaignInfo.watch.initialClickedUserGroupResourceId.handler.call(ctx, '')
      expect(ctx.callForTargetGroups).not.toHaveBeenCalled()
    })
  })
})
